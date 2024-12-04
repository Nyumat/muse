import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Song } from "@/features/songs/dashboard/view";
import { cn, formatTime } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CgMiniPlayer } from "react-icons/cg";
import { toast } from "sonner";

export function MiniPlayer() {
  const [showQueue, setShowQueue] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    queueIndex,
    isShuffled,
    isRepeating,
    bufferedTime,
    playPause,
    seek,
    setVolume,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
    playQueueItem,
  } = useAudioStore();

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      seek(percent * duration);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        if (!currentSong) {
          toast.error("No song is playing");
        } else {
          setCollapsed((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSong]);

  const canPlayNext = queueIndex < queue.length - 1 || isRepeating;
  const canPlayPrevious = queueIndex > 0 || currentTime > 3;

  const QueueItem = useMemo(
    () =>
      ({
        song,
        index,
        currentSongId,
      }: {
        song: Song;
        index: number;
        currentSongId: string;
      }) =>
        (
          <div
            onClick={() => playQueueItem(index)}
            className={cn(
              "flex items-center justify-between py-2 px-4 rounded-lg transition-colors cursor-pointer",
              song._id === currentSongId && "bg-primary/10",
              song._id !== currentSongId && "hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-4">
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.uploader}</p>
              </div>
            </div>
            {song._id === currentSongId && isPlaying && (
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            )}
          </div>
        ),

    [isPlaying, playQueueItem]
  );

  const ControlButtons = useMemo(
    () => () =>
      (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={previousSong}
            disabled={!canPlayPrevious}
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
            onClick={playPause}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 text-primary-foreground" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={nextSong}
            disabled={!canPlayNext}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </>
      ),
    [canPlayNext, canPlayPrevious, isPlaying, nextSong, playPause, previousSong]
  );

  if (!currentSong) return null;

  if (collapsed) {
    return (
      <>
        <Button asChild>
          <motion.button
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            title="Open Mini Player"
            exit={{ y: "100%" }}
            onClick={() => setCollapsed(false)}
            className="fixed -bottom-1 right-20 h-12 w-8 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg"
          >
            <CgMiniPlayer className="w-5 h-5" />
          </motion.button>
        </Button>
      </>
    );
  }

  const playerVariants = {
    mini: {
      height: "72px",
      y: 0,
    },
    expanded: {
      height: "100vh",
      y: 0,
    },
    hidden: {
      y: "100%",
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate={expanded ? "expanded" : "mini"}
        variants={playerVariants}
        transition={{ type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50"
      >
        <div
          className={cn(
            "h-full transition-opacity",
            expanded && "opacity-0 pointer-events-none"
          )}
        >
          <div className="container mx-auto h-full flex items-center justify-between gap-4 px-4">
            <div className="flex items-center flex-1 min-w-0 gap-3">
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{currentSong.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {currentSong.uploader}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ControlButtons />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                onClick={() => setShowQueue(true)}
              >
                <ListMusic className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hidden md:flex"
                onClick={() => setExpanded(true)}
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setCollapsed(true)}
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setExpanded(false)}
                >
                  <ChevronDown className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowQueue(true)}
                  >
                    <ListMusic className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCollapsed(true)}
                  >
                    <Minimize2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-lg mx-auto w-full">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-64 h-64 rounded-2xl object-cover shadow-xl"
                />

                <div className="text-center w-full">
                  <h2 className="text-xl font-semibold mb-2 whitespace-nowrap">
                    {currentSong.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentSong.uploader}
                  </p>
                </div>

                <div className="w-full space-y-2">
                  <div
                    ref={progressBarRef}
                    onClick={handleProgressClick}
                    className="h-1.5 bg-secondary rounded-full overflow-hidden cursor-pointer group"
                  >
                    <div
                      className="h-full bg-muted-foreground/30 rounded-full"
                      style={{ width: `${(bufferedTime / duration) * 100}%` }}
                    />
                    <div
                      className="h-full bg-primary group-hover:bg-primary/90 -translate-y-full rounded-full relative"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleShuffle}
                      className={cn(
                        "text-muted-foreground hover:text-primary",
                        isShuffled && "text-primary"
                      )}
                    >
                      <Shuffle className="w-5 h-5" />
                    </Button>

                    <ControlButtons />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleRepeat}
                      className={cn(
                        "text-muted-foreground hover:text-primary",
                        isRepeating && "text-primary"
                      )}
                    >
                      <Repeat className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVolume(volume === 0 ? 1 : 0)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      max={100}
                      step={1}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Sheet open={showQueue} onOpenChange={setShowQueue}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader className="px-6">
              <SheetTitle className="text-xl font-semibold">Up Next</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full px-6 my-2 pb-6">
              <div className="space-y-2">
                {queue.map((song, index) => (
                  <QueueItem
                    key={song._id}
                    song={song}
                    index={index}
                    currentSongId={currentSong?._id}
                  />
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </motion.div>
    </AnimatePresence>
  );
}
