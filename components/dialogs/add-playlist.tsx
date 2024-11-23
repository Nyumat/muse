"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusIcon } from "lucide-react";

export function AddPlaylistDialog({ userId }: { userId: string }) {
  const [playlistName, setPlaylistName] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlaylistName(value);
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!playlistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: playlistName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      setPlaylistName("");
      setOpen(false);
    } catch (err) {
      setError("Failed to create playlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PlusIcon
          size={18}
          className="text-gray-300 hover:text-white cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new playlist</DialogTitle>
          <DialogDescription>
            Enter a name for your new playlist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="My Awesome Playlist"
            value={playlistName}
            onChange={handleInputChange}
            className={error ? "border-red-500" : ""}
            disabled={isSubmitting}
          />

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
