import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Lock, Globe, Users, Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import Fetcher from "@/lib/fetcher";

const api = Fetcher.getInstance();

// Validation schema
const createPlaylistSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(["private", "public", "friends"]),
  coverImage: z.instanceof(FileList).optional(),
});

type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;

interface CreatePlaylistResponse {
  _id: string;
  name: string;
  description: string;
  visibility: "private" | "public" | "friends";
  coverImage: string;
  songs: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export function CreatePlaylistDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePlaylistInput>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      visibility: "private",
    },
  });

  const createPlaylist = useMutation({
    mutationFn: async (data: CreatePlaylistInput) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (
            key === "coverImage" &&
            value instanceof FileList &&
            value.length > 0
          ) {
            formData.append("coverImage", value[0]);
          } else if (key !== "coverImage") {
            formData.append(key, value as string);
          }
        }
      });

      const { data: responseData } = await api.post<CreatePlaylistResponse>(
        "/api/playlists",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist created successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create playlist"
      );
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = (data: CreatePlaylistInput) => {
    createPlaylist.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue("coverImage", e.target.files as FileList);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Plus className="mr-2 h-4 w-4" /> Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-lg border-purple-500/50">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverImage" className="block mb-2">
                Cover Image
              </Label>
              <div className="flex items-center gap-4">
                <div
                  className={`w-32 h-32 rounded-md overflow-hidden relative group cursor-pointer ${
                    !previewUrl ? "bg-black/20" : ""
                  }`}
                  onClick={() => document.getElementById("coverImage")?.click()}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 300x300px
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max file size: 2MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="bg-black/20"
                {...register("name")}
                placeholder="My Awesome Playlist"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="bg-black/20"
                {...register("description")}
                placeholder="Add an optional description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={watch("visibility")}
                onValueChange={(value: "private" | "public" | "friends") =>
                  setValue("visibility", value)
                }
              >
                <SelectTrigger className="bg-black/20">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Private</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Friends</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Public</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-black/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPlaylist.isPending}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {createPlaylist.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Playlist"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
