import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Fetcher from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Music, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const api = Fetcher.getInstance();

// Validation schema
const addSongSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) =>
        url.includes("youtube.com") ||
        url.includes("youtu.be") ||
        url.includes("soundcloud.com"),
      "URL must be from YouTube or SoundCloud"
    ),
});

type AddSongInput = z.infer<typeof addSongSchema>;

export function AddSongDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSongInput>({
    resolver: zodResolver(addSongSchema),
  });

  const addSong = useMutation({
    mutationFn: async (data: AddSongInput) => {
      const response = await api.post("/api/songs", {
        mediaUrl: data.url,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Song added successfully");
      handleClose();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to add song";
      toast.error(errorMessage);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: AddSongInput) => {
    addSong.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Plus className="mr-2 h-4 w-4" /> Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-lg border-purple-500/50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Add New Song
          </DialogTitle>
          <DialogDescription>
            Paste a YouTube or SoundCloud URL to add a song to your library
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Song URL</Label>
              <Input
                id="url"
                className="bg-black/20"
                {...register("url")}
                placeholder="https://youtube.com/watch?v=... or https://soundcloud.com/..."
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.url.message}
                </p>
              )}
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
              disabled={addSong.isPending}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {addSong.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                "Add Song"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
