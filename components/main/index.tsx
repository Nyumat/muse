"use client";

import { useNavigationStore } from "@/stores/nav";
import { Header } from "./header";
import { DailyMixView } from "./views/daily-mix";
import { HomeView } from "./views/home";
import { LibraryView } from "./views/library";
import { PlaylistView } from "./views/playlist";
import { SearchView } from "./views/search";

import { type Playlist, type Track } from "@/lib/utils";

export interface MainViewProps {
  playlists: Playlist[];
  tracks: Track[];
  userId: string;
}

export function MainView({ tracks, userId }: MainViewProps) {
  const { currentView } = useNavigationStore();
  return (
    <main className="flex-1 bg-gradient-to-b from-gray-900 to-black p-8 overflow-auto">
      <Header />
      {currentView === "home" && <HomeView />}
      {currentView === "search" && <SearchView />}
      {currentView === "library" && <LibraryView tracks={tracks} />}
      {currentView.startsWith("playlist-") && (
        <PlaylistView id={currentView.split("playlist-")[1]} userId={userId} />
      )}
      {currentView.startsWith("daily-mix-") && (
        <DailyMixView id={currentView.split("-")[2]} />
      )}
    </main>
  );
}
