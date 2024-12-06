import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Song } from "@/features/songs/dashboard/view";
import Fetcher from "@/lib/fetcher";
import { usePlayerControls } from "@/stores/audioStore";
import { useQuery } from "@tanstack/react-query";
import { Globe, Loader2, Lock, Play, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CreatePlaylistDialog } from "./create-dialog";

const api = Fetcher.getInstance();

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  visibility: "private" | "public" | "friends";
  songs: Song[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export function PlaylistView() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { playSong } = usePlayerControls();

  const { data: playlists, isLoading } = useQuery<Playlist[]>({
    queryKey: ["playlists"],
    queryFn: async () => {
      const { data } = await api.get<Playlist[]>("/api/playlists");
      return data;
    },
  });

  const filteredPlaylists = playlists?.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm backdrop-blur-lg"
        />
        <CreatePlaylistDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          filteredPlaylists?.map((playlist) => (
            <Card
              key={playlist._id}
              className="group bg-black/10 backdrop-blur-md border-none shadow-sm hover:shadow-md hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/dashboard/playlists/${playlist._id}`)}
            >
              <CardContent className="p-6">
                <div className="aspect-square mb-4 relative overflow-hidden rounded-md">
                  <img
                    src={playlist.coverImage || "/default-cover.svg"}
                    alt={playlist.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (playlist.songs.length > 0) {
                          playSong(playlist.songs[0]._id);
                        }
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {playlist.songs.length} songs
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {playlist.visibility === "private" && (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    {playlist.visibility === "public" && (
                      <Globe className="h-3 w-3 mr-1" />
                    )}
                    {playlist.visibility === "friends" && (
                      <Users className="h-3 w-3 mr-1" />
                    )}
                    {playlist.visibility}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
