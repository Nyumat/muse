"use client";

import { createContext, useContext, useRef, useState } from "react";

interface TrackContextType {
  currentTrack: any;
  setCurrentTrack: React.Dispatch<React.SetStateAction<any>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  trackProgress: {};
  setTrackProgress: React.Dispatch<React.SetStateAction<{}>>;
  audioRef: React.MutableRefObject<HTMLAudioElement>;
}

const TrackContext = createContext<TrackContextType | null>(null);

export function TrackProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState({});
  const audioRef = useRef(new Audio());

  const value = {
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    trackProgress,
    setTrackProgress,
    audioRef,
  };

  return (
    <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
  );
}

export const useTrackContext = () => useContext(TrackContext);