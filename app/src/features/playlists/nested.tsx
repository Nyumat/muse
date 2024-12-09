import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Song } from "@/features/songs/dashboard/view";
import { useUser } from "@/hooks/use-user";
import Fetcher from "@/lib/fetcher";
import { cn, formatDuration } from "@/lib/utils";
import { useAudioStore, usePlayerControls } from "@/stores/audioStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import {
    Globe,
    GripVertical,
    ImagePlus,
    Lock,
    MoreVertical,
    Music,
    Pause,
    Pencil,
    Play,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const api = Fetcher.getInstance();

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  visibility: "public" | "private" | "friends";
  createdBy: {
    _id: string;
    username: string;
  };
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

export function PlaylistViewNested() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUser } = useUser();
  const { playSong } = usePlayerControls();
  const { currentSong, isPlaying } = useAudioStore();
  const dragControls = useDragControls();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAddSongDialog, setShowAddSongDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  const { data: playlist, isLoading } = useQuery<Playlist>({
    queryKey: ["playlists", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/playlists/${id}`);
      setSongs(data.songs);
      return data;
    },
  });

  const { data: availableSongs } = useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: async () => {
      const { data } = await api.get("/api/songs");
      return data;
    },
  });

  const updatePlaylist = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.put(`/api/playlists/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists", id] });
      setIsEditMode(false);
      toast.success("Playlist updated successfully");
    },
  });

  const deletePlaylist = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/playlists/${id}`);
    },
    onSuccess: () => {
      navigate("/dashboard/playlists");
      toast.success("Playlist deleted successfully");
    },
  });

  const addSong = useMutation({
    mutationFn: async (songId: string) => {
      await api.post(`/api/playlists/${id}/songs`, { songId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists", id] });
      setShowAddSongDialog(false);
      toast.success("Song added to playlist");
    },
  });

  const removeSong = useMutation({
    mutationFn: async (songId: string) => {
      await api.delete(`/api/playlists/${id}/songs/${songId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists", id] });
      toast.success("Song removed from playlist");
    },
  });

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdatePlaylist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updatePlaylist.mutate(formData);
  };

  const handleReorder = async (newOrder: Song[]) => {
    setSongs(newOrder);
    // Here you would typically update the order in the backend
    // await api.put(`/api/playlists/${id}/reorder`, { songs: newOrder.map(song => song._id) });
  };

  if (isLoading || !playlist || !id) {
    return <div>Loading...</div>;
  }

  const isOwner = currentUser?._id === playlist.createdBy._id;

  return (
    <div className="space-y-6">
      <Card className="bg-black/10 backdrop-blur-md border-none shadow-sm shadow-purple-500/50 border-t-2 border-t-purple-500">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative w-48 h-48">
              {isEditMode ? (
                <div
                  className="w-full h-full rounded-md overflow-hidden cursor-pointer group"
                  onClick={() => document.getElementById("coverImage")?.click()}
                >
                  <img
                    src={
                        previewUrl ||
                        playlist.coverImage ||
                        "/default-cover.svg"
                    }
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={playlist.coverImage || "/default-cover.svg"}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex-1">
              {isEditMode ? (
                <form onSubmit={handleUpdatePlaylist} className="space-y-4">
                  <Input
                    type="file"
                    id="coverImage"
                    name="cover"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                  />
                  <Input
                    name="name"
                    defaultValue={playlist.name}
                    className="text-2xl font-bold bg-black/20"
                    placeholder="Playlist Name"
                  />
                  <Textarea
                    name="description"
                    defaultValue={playlist.description}
                    className="bg-black/20"
                    placeholder="Add an optional description"
                  />
                  <Select name="visibility" defaultValue={playlist.visibility}>
                    <SelectTrigger className="w-[200px] bg-black/20">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Private
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" /> Friends
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Public
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">
                        {playlist.name}
                      </h1>
                      {playlist.description && (
                        <p className="text-muted-foreground mb-4">
                          {playlist.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {playlist.visibility === "private" && (
                          <Lock className="w-4 h-4" />
                        )}
                        {playlist.visibility === "public" && (
                          <Globe className="w-4 h-4" />
                        )}
                        {playlist.visibility === "friends" && (
                          <Users className="w-4 h-4" />
                        )}
                        <span>{playlist.visibility}</span>
                        <span>•</span>
                        <span>{playlist.songs.length} songs</span>
                      </div>
                    </div>
                    {isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setShowAddSongDialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Songs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setShowDeleteAlert(true)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Playlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Reorder.Group
        axis="y"
        values={songs}
        onReorder={handleReorder}
        className="space-y-1"
      >
        {songs.map((song) => (
          <Reorder.Item
            key={song._id}
            value={song}
            dragControls={dragControls}
            className={cn(
              "flex items-center gap-4 p-3 bg-black/10 backdrop-blur-md rounded-md hover:bg-black/20 group",
              currentSong?._id === song._id && "bg-purple-500/20"
            )}
          >
            <GripVertical
              className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab"
              onPointerDown={(e) => dragControls.start(e)}
            />
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{song.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {song.uploader}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDuration(song.duration)}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => await playSong(song._id, playlist._id)}
              >
                {currentSong?._id === song._id && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSong.mutate(song._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Song Dialog */}
      <Dialog open={showAddSongDialog} onOpenChange={setShowAddSongDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Songs to Playlist</DialogTitle>
            <DialogDescription>
              Select songs to add to your playlist
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2">
            {availableSongs
              ?.filter((song) => !songs.find((s) => s._id === song._id))
              .map((song) => (
                <div
                  key={song._id}
                  className="flex items-center gap-4 p-2 hover:bg-black/10 rounded-md"
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{song.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {song.uploader}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDuration(song.duration)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => addSong.mutate(song._id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSongDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this playlist? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePlaylist.mutate()}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty State */}
      {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Music className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No songs in this playlist
          </h3>
          {isOwner ? (
            <>
              <p className="text-muted-foreground mb-4">
                Start building your playlist by adding some songs
              </p>
              <Button onClick={() => setShowAddSongDialog(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Songs
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">
              The playlist owner hasn't added any songs yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
