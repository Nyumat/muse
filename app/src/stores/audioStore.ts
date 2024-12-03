import { Song } from "@/features/songs/dashboard/view";
import Fetcher from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const api = Fetcher.getInstance();

interface AudioState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  queueIndex: number;

  initializeAudio: (songs: Song[], startIndex: number) => void;
  play: () => void;
  pause: () => void;
  playPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  repeatQueue: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => {
      let audioElement: HTMLAudioElement | null = null;

      return {
        currentSong: null,
        isPlaying: false,
        volume: 1,
        currentTime: 0,
        duration: 0,
        queue: [],
        queueIndex: 0,

        initializeAudio: (songs, startIndex) => {
          set({ queue: songs, queueIndex: startIndex });
          const currentSong = songs[startIndex];

          if (audioElement) {
            audioElement.pause();
          }

          audioElement = new Audio(currentSong.stream_url);
          audioElement.volume = get().volume;

          audioElement.addEventListener("timeupdate", () => {
            set({ currentTime: audioElement?.currentTime || 0 });
          });

          audioElement.addEventListener("loadedmetadata", () => {
            set({ duration: audioElement?.duration || 0 });
          });

          audioElement.addEventListener("ended", () => {
            get().nextSong();
          });

          set({ currentSong, isPlaying: false });
        },

        play: () => {
          if (audioElement) {
            audioElement.play();
            set({ isPlaying: true });
          }
        },

        pause: () => {
          if (audioElement) {
            audioElement.pause();
            set({ isPlaying: false });
          }
        },

        playPause: () => {
          const { isPlaying } = get();
          if (isPlaying) {
            get().pause();
          } else {
            get().play();
          }
        },

        shuffleQueue: () => {
          set({
            queue: get().queue.sort(() => Math.random() - 0.5),
          });
        },

        repeatQueue: () => {
          set({
            queue: [...get().queue, ...get().queue],
          });
        },

        seek: (time) => {
          if (audioElement) {
            audioElement.currentTime = time;
            set({ currentTime: time });
          }
        },

        setVolume: (volume) => {
          if (audioElement) {
            audioElement.volume = volume;
            set({ volume });
          }
        },

        nextSong: () => {
          const { queue, queueIndex } = get();
          if (queueIndex < queue.length - 1) {
            const nextIndex = queueIndex + 1;
            const nextSong = queue[nextIndex];

            if (audioElement) {
              audioElement.pause();
            }

            audioElement = new Audio(nextSong.stream_url);
            audioElement.volume = get().volume;

            audioElement.addEventListener("timeupdate", () => {
              set({ currentTime: audioElement?.currentTime || 0 });
            });

            audioElement.addEventListener("loadedmetadata", () => {
              set({ duration: audioElement?.duration || 0 });
            });

            audioElement.addEventListener("ended", () => {
              get().nextSong();
            });

            set({
              currentSong: nextSong,
              queueIndex: nextIndex,
              currentTime: 0,
            });

            get().play();
          }
        },

        previousSong: () => {
          const { queue, queueIndex } = get();
          if (queueIndex > 0) {
            const previousIndex = queueIndex - 1;
            const previousSong = queue[previousIndex];

            if (audioElement) {
              audioElement.pause();
            }

            audioElement = new Audio(previousSong.stream_url);
            audioElement.volume = get().volume;

            audioElement.addEventListener("timeupdate", () => {
              set({ currentTime: audioElement?.currentTime || 0 });
            });

            audioElement.addEventListener("loadedmetadata", () => {
              set({ duration: audioElement?.duration || 0 });
            });

            audioElement.addEventListener("ended", () => {
              get().nextSong();
            });

            set({
              currentSong: previousSong,
              queueIndex: previousIndex,
              currentTime: 0,
            });

            get().play();
          }
        },

        addToQueue: (song) => {
          const { queue } = get();
          set({ queue: [...queue, song] });
        },

        removeFromQueue: (index) => {
          const { queue, queueIndex } = get();
          const newQueue = queue.filter((_, i) => i !== index);
          set({
            queue: newQueue,
            queueIndex: index < queueIndex ? queueIndex - 1 : queueIndex,
          });
        },

        clearQueue: () => {
          if (audioElement) {
            audioElement.pause();
          }
          set({
            queue: [],
            queueIndex: 0,
            currentSong: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
          });
        },
      };
    },
    {
      name: "audio-storage",
      partialize: (state) => ({
        volume: state.volume,
        queue: state.queue,
        queueIndex: state.queueIndex,
      }),
    }
  )
);

export function usePlayerControls() {
  const { data: songs } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await api.get<Song[]>("/api/songs");
      return res.data;
    },
  });

  const store = useAudioStore();

  const playSong = (songId: string) => {
    if (!songs) return;
    const songIndex = songs.findIndex((song) => song._id === songId);
    if (songIndex === -1) return;
    store.initializeAudio(songs, songIndex);
    store.play();
  };

  const toggleRepeat = () => {
    store.repeatQueue();
  };

  const toggleShuffle = () => {
    store.shuffleQueue();
  };

  return {
    playSong,
    toggleRepeat,
    toggleShuffle,
    ...store,
  };
}
