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
import { Label } from "@/components/ui/label";

export function AddSongDialog() {
  const [open, setOpen] = useState(false);
  const [songData, setSongData] = useState({
    title: "",
    duration: "",
    mediaUrl: "",
    thumbnail: "",
    tags: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSongData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitting song data:", songData);
    // Reset form and close dialog
    setSongData({
      title: "",
      duration: "",
      mediaUrl: "",
      thumbnail: "",
      tags: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Song</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Enter the details of the new song here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={songData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                name="duration"
                value={songData.duration}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="3:30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mediaUrl" className="text-right">
                Media URL
              </Label>
              <Input
                id="mediaUrl"
                name="mediaUrl"
                value={songData.mediaUrl}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thumbnail" className="text-right">
                Thumbnail
              </Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={songData.thumbnail}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={songData.tags}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Separate tags with commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Song</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
