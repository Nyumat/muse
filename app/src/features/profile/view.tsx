import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Song } from "@/features/songs/dashboard/view";
import Fetcher from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const api = Fetcher.getInstance();

const updateUserSchema = z
  .object({
    username: z.string().min(3).max(20).optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    bio: z.string().optional(),
    password: z.string().optional(),
    pfp: z.instanceof(FileList).optional(),
  })
  .refine(
    (data) => {
      if (data.username !== undefined && data.username.length === 0)
        return false;
      if (data.email !== undefined && data.email.length === 0) return false;
      return true;
    },
    {
      message: "Required fields cannot be empty if provided",
    }
  );

type UpdateUserInput = z.infer<typeof updateUserSchema>;

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface UserWithId {
  _id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  pfp: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

interface PutProfileResponse {
  updatedUser: UserWithId;
  newToken: string;
}

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPfp, setCurrentPfp] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery<UserWithId>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await api.get<UserWithId>("/auth/details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return data;
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.error || "Failed to fetch user details"
          );

          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        } else {
          toast.error("An unexpected error occurred");
        }
        throw err;
      }
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
      });
      setCurrentPfp(user.pfp);
    }
  }, [user, reset]);

  const watchPfp = register("pfp", {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
  });

  const updateMutation = useMutation<
    ApiResponse<UserWithId>,
    Error,
    UpdateUserInput
  >({
    mutationFn: async (data: UpdateUserInput) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "pfp" && value instanceof FileList && value.length > 0) {
            formData.append("pfp", value[0]);
          } else if (key !== "pfp") {
            formData.append(key, value as string);
          }
        }
      });

      try {
        const { data: responseData } = await api.put<PutProfileResponse>(
          "/auth/update",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        localStorage.setItem("token", responseData.newToken);

        return { data: responseData.updatedUser };
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.error || "Update failed");
        }
        throw err;
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["use-user"] });

      if (response.data?.pfp) {
        setCurrentPfp(response.data.pfp);
      }

      setIsEditing(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = (data: UpdateUserInput) => {
    const changedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        if (key === "pfp" && value instanceof FileList) {
          return value.length > 0;
        }
        return (
          value !== undefined &&
          value !== null &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value !== (user as any)?.[key]
        );
      })
    );

    if (Object.keys(changedData).length === 0) {
      toast.info("No changes to save");
      return;
    }

    updateMutation.mutate(changedData as UpdateUserInput);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleCancel = () => {
    setIsEditing(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    reset({
      username: user?.username,
      email: user?.email,
      name: user?.name,
      bio: user?.bio,
    });
  };

  return (
    <Card className=" h-full mx-auto bg-black/10 backdrop-blur-md border-none shadow-sm  shadow-purple-500/50 border-t-2 border-t-purple-500">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={previewUrl || currentPfp || undefined}
                alt="Profile Picture"
              />
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <Label htmlFor="pfp">Profile Picture</Label>
                <Input
                  id="pfp"
                  type="file"
                  accept="image/*"
                  onChange={watchPfp.onChange}
                  name={watchPfp.name}
                  ref={watchPfp.ref}
                />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                disabled={!isEditing}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled={!isEditing}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" disabled={!isEditing} {...register("name")} />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" disabled={!isEditing} {...register("bio")} />
            </div>

            {isEditing && (
              <div>
                <Label htmlFor="password">New Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
