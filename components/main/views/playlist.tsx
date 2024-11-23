"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { type Playlist, type Track } from "@/lib/utils";
import { useAudioStore } from "@/stores/audio";
import {
  Clock,
  Heart,
  MoreHorizontal,
  MoreVertical,
  Music2,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import Image from "next/image";
import useSWR from "swr";

async function fetchPlaylist({ id, userId }: { id: string; userId: string }) {
  const res = await fetch(`/api/playlists/${id}/${userId}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as Playlist;
}

function PlaylistHeader({ playlist }: { playlist: Playlist }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } =
    useAudioStore();
  const isPlaylistPlaying =
    isPlaying && currentTrack?.id === playlist?.tracks[0]?.id;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-6">
        <div className="relative aspect-square w-48 overflow-hidden rounded-md shadow-2xl">
          <AspectRatio ratio={1} />
        </div>
        <div className="flex flex-col justify-end gap-2">
          <div className="text-sm font-semibold uppercase text-green-400">
            Playlist
          </div>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{playlist?.tracks?.length} tracks</span>
            <span>•</span>
            <span>{Math.floor(playlist.running_time / 60)} minutes</span>
            <span>•</span>
            <span>Updated 2 days ago</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          size="lg"
          className="group h-14 w-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
          onClick={() => {}}
        >
          {isPlaylistPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-gray-400 hover:text-white"
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-gray-400 hover:text-white"
        >
          <Share2 className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-gray-400 hover:text-white"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

function TrackList({ tracks }: { tracks: Track[] }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } =
    useAudioStore();

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  return (
    <ScrollArea className="flex-1 px-6">
      <div className="mb-2 grid grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-4 px-4 text-sm text-gray-400">
        <div className="w-8">#</div>
        <div>Title</div>
        <div>Album</div>
        <div>Artist</div>
        <Clock className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        {tracks?.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;

          return (
            <button
              key={track.id}
              onClick={() => handleTrackClick(track)}
              className={`group grid grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-4 rounded-md px-4 py-2 text-left hover:bg-white/5 ${
                isCurrentTrack ? "text-green-400" : "text-white"
              }`}
            >
              <div className="w-8 text-base">
                {isCurrentTrack ? (
                  isPlaying ? (
                    <div className="flex items-end gap-0.5 h-3">
                      <div className="w-0.5 h-full bg-green-500 animate-music-bar"></div>
                      <div className="w-0.5 h-2/3 bg-green-500 animate-music-bar animation-delay-200"></div>
                      <div className="w-0.5 h-1/3 bg-green-500 animate-music-bar animation-delay-400"></div>
                    </div>
                  ) : (
                    <Play className="h-4 w-4" />
                  )
                ) : (
                  <span className="text-gray-400 group-hover:hidden">
                    {index + 1}
                  </span>
                )}
                <Play className="hidden h-4 w-4 group-hover:block" />
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                  {track.image_url ? (
                    <Image
                      src={track.image_url}
                      alt={track.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800">
                      <Music2 className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <span className="truncate">{track.title}</span>
              </div>
              <div className="truncate text-gray-400">{track.album}</div>
              <div className="truncate text-gray-400">{track.artist}</div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">{track.duration}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Add to Queue</DropdownMenuItem>
                    <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      Remove from Playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex gap-6">
        <Skeleton className="h-48 w-48 rounded-md" />
        <div className="flex flex-col justify-end gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

export function PlaylistView({ id, userId }: { id: string; userId: string }) {
  const { data: playlist, error } = useSWR({ id, userId }, fetchPlaylist);

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Failed to load playlist</h2>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return <PlaylistSkeleton />;
  }

  return (
    <div className="flex h-[80vh] flex-col">
      <PlaylistHeader playlist={playlist} />
      <TrackList tracks={playlist.tracks} />
    </div>
  );
}
