import { useAudioStore } from "@/stores/audio";
import { useEffect } from "react";

export function useAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    trackProgress,
    audioRef,
    setTrackProgress,
    seekToPosition,
  } = useAudioStore();

  useEffect(() => {
    if (!audioRef.current) throw new Error("Audio element not found.");
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (currentTrack && audio.duration > 0) {
        setTrackProgress({
          ...trackProgress,
          [currentTrack.id]: (audio.currentTime / audio.duration) * 100,
        });
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentTrack, audioRef, setTrackProgress, trackProgress]);

  return { seekToPosition, trackProgress };
}
