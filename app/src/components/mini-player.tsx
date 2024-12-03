/* eslint-disable @typescript-eslint/no-unused-vars */import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Maximize2,
  Minimize2,
  List,
} from "lucide-react";
import { usePlayerControls } from "@/stores/audioStore";
import { cn, formatTime } from "@/lib/utils";
import { type Song } from "@/features/songs/dashboard/view";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    playPause,
    seek,
    setVolume,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerControls();

  const [expanded, setExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        playPause();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playPause]);

  if (!currentSong) return null;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      seek(percent * duration);
    }
  };

  const Controls = () => (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleShuffle}
        className="text-muted-foreground hover:text-primary"
      >
        <Shuffle className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={previousSong}
        className="hover:text-primary"
      >
        <SkipBack className="w-6 h-6" />
      </Button>
      <Button
        size="icon"
        onClick={playPause}
        className="h-12 w-12 rounded-full"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSong}
        className="hover:text-primary"
      >
        <SkipForward className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleRepeat}
        className="text-muted-foreground hover:text-primary"
      >
        <Repeat className="w-5 h-5" />
      </Button>
    </div>
  );

  const VolumeControl = () => (
    <div className="hidden md:flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary"
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        {volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </Button>
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 100, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="w-24"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const ProgressBar = () => (
    <div className="w-full px-4 md:px-0">
      <div
        ref={progressBarRef}
        className="h-1.5 bg-secondary rounded-full overflow-hidden cursor-pointer group"
        onClick={handleProgressBarClick}
      >
        <div
          className="h-full bg-primary group-hover:bg-primary/90 transition-colors"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );

  const QueueItem = ({ song }: { song: Song }) => (
    <div
      className={cn(
        "flex items-center p-3 rounded-md transition-colors",
        song._id === currentSong._id ? "bg-secondary" : "hover:bg-secondary/50"
      )}
    >
      <img
        src={song.thumbnail}
        alt={song.title}
        className="w-12 h-12 rounded object-cover"
      />
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{song.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {song.uploader}
        </p>
      </div>
    </div>
  );

  const MobileView = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="md:hidden fixed bottom-20 right-4 rounded-full shadow-lg z-50"
        >
          <List className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <div className="flex flex-col items-center gap-6 pt-6">
          <img
            src={currentSong.thumbnail}
            alt={currentSong.title}
            className="w-48 h-48 rounded-lg object-cover shadow-lg"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold">{currentSong.title}</h3>
            <p className="text-sm text-muted-foreground">
              {currentSong.uploader}
            </p>
          </div>
          <ProgressBar />
          <Controls />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40",
          expanded ? "h-[calc(100vh-4rem)]" : "h-20"
        )}
      >
        <div className="container mx-auto h-full">
          <div className="hidden md:flex h-full">
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex w-full gap-8 p-6"
                >
                  <div className="flex-1 flex flex-col items-center justify-start pt-8 gap-8">
                    <img
                      src={currentSong.thumbnail}
                      alt={currentSong.title}
                      className="w-64 h-64 rounded-lg object-cover shadow-lg"
                    />
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {currentSong.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {currentSong.uploader}
                      </p>
                    </div>
                    <ProgressBar />
                    <Controls />
                    <VolumeControl />
                  </div>
                  <Card className="w-80">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Queue</h3>
                      <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="space-y-2 pr-4">
                          {queue.map((song: Song) => (
                            <QueueItem key={song._id} song={song} />
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center w-full px-6"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <img
                      src={currentSong.thumbnail}
                      alt={currentSong.title}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {currentSong.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {currentSong.uploader}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Controls />
                    <VolumeControl />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:hidden flex items-center h-full px-4">
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="ml-3 flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">
                {currentSong.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.uploader}
              </p>
            </div>
            <Button
              size="icon"
              onClick={playPause}
              className="ml-4 rounded-full h-10 w-10"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="hidden md:flex absolute top-4 right-4 text-muted-foreground hover:text-primary"
        >
          {expanded ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </Button>
      </motion.div>

      <MobileView />
    </>
  );
}