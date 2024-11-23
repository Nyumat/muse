"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Playlist } from "@/lib/utils";
import { useNavigationStore } from "@/stores/nav";
import { Home, Library, Search } from "lucide-react";
import { AddPlaylistDialog } from "../dialogs/add-playlist";

interface SidebarProps {
  userId: string;
  playlists: Playlist[];
}

export function Sidebar({ userId, playlists }: SidebarProps) {
  const { currentView, changeView } = useNavigationStore();
  return (
    <aside className="w-60 bg-black p-6">
      <nav className="flex flex-col gap-y-4">
        <Button
          variant="ghost"
          className={`flex items-center justify-start gap-x-3 ${
            currentView === "home"
              ? "text-white bg-blue-500"
              : "text-gray-300 hover:text-black"
          }`}
          onClick={() => changeView("home")}
        >
          <Home size={24} />
          Home
        </Button>
        <Button
          variant="ghost"
          className={`flex items-center justify-start gap-x-3 ${
            currentView === "search"
              ? "text-white bg-blue-500"
              : "text-gray-300 hover:text-black"
          }`}
          onClick={() => changeView("search")}
        >
          <Search size={24} />
          Search
        </Button>
        <Button
          variant="ghost"
          className={`flex items-center justify-start gap-x-3 ${
            currentView === "library"
              ? "text-white bg-blue-500"
              : "text-gray-300 hover:text-black"
          }`}
          onClick={() => changeView("library")}
        >
          <Library size={24} />
          Your Library
        </Button>
      </nav>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">PLAYLISTS</h2>
          <AddPlaylistDialog userId={userId} />
        </div>
        <ScrollArea className="h-[calc(100vh-300px)] mt-4">
          <div className="flex flex-col gap-y-2">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="justify-start"
                onClick={() => changeView(`playlist-${playlist.id}`)}
              >
                {playlist.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
