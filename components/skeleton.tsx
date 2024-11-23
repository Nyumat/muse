"use client";

import { TrackProvider } from "@/context/track-context";
import { type Playlist, type Track } from "@/lib/utils";
import { MainView } from "./main";
import { Player } from "./player";
import { Sidebar } from "./sidebar";

interface SkeletonLayoutProps {
  playlists: Playlist[];
  tracks: Track[];
  userId: string;
}

export function SkeletonLayout({
  playlists,
  tracks,
  userId,
}: SkeletonLayoutProps) {
  return (
    <TrackProvider>
      <div className="h-screen flex flex-col bg-black text-white">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar userId={userId} playlists={playlists} />
          <MainView tracks={tracks} playlists={playlists} userId={userId} />
        </div>
        <Player />
      </div>
    </TrackProvider>
  );
}
