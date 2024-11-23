"use client";

import { downloadAudio } from "@/audioExtract";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useCallback, useState } from "react";

export function AddTrackDialog() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const soundCloudRegex = /^(https?:\/\/)?(www\.)?(soundcloud\.com)\/.+$/;

  const validateYoutubeLink = useCallback((link: string) => {
    if (!link) {
      return "To add a track, please enter a YouTube URL";
    }
    if (!youtubeRegex.test(link)) {
      return "Please enter a valid YouTube URL";
    }
    return "";
  }, []);

  const validateSoundCloudLink = useCallback((link: string) => {
    if (!link) {
      return "To add a track, please enter a SoundCloud URL";
    }

    if (!soundCloudRegex.test(link)) {
      return "Please enter a valid SoundCloud URL";
    }

    return "";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYoutubeLink(value);
    if (error) setError("");
  };

  const handleSubmit = async () => {
    const youtubeLinkError = validateYoutubeLink(youtubeLink);
    const soundCloudLinkError = validateSoundCloudLink(youtubeLink);

    if (youtubeLinkError && soundCloudLinkError) {
      setError("Please enter a valid YouTube or SoundCloud URL");
      return;
    }

    setIsSubmitting(true);
    try {
      await downloadAudio(youtubeLink, "./downloads");
      setYoutubeLink("");
      setOpen(false);
    } catch (err) {
      setError("Failed to add track. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="mb-4">
          Add Track
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new track</DialogTitle>
          <DialogDescription>
            Enter the YouTube video link below to add a new track to your
            playlist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
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
            {isSubmitting ? "Adding..." : "Add Track"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
