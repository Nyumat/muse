import { type Song } from "@/features/songs/dashboard/view";
import Fetcher from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  queueIndex: number;
  isShuffled: boolean;
  isRepeating: boolean;
  originalQueue: Song[]; // Keep track of original queue order

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
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => {
      let audioElement: HTMLAudioElement | null = null;

      const setupAudioElement = (song: Song) => {
        if (audioElement) {
          audioElement.pause();
          audioElement.removeEventListener("timeupdate", timeUpdateHandler);
          audioElement.removeEventListener(
            "loadedmetadata",
            loadedMetadataHandler
          );
          audioElement.removeEventListener("ended", endedHandler);
        }

        audioElement = new Audio(song.stream_url);
        audioElement.volume = get().volume;

        audioElement.addEventListener("timeupdate", timeUpdateHandler);
        audioElement.addEventListener("loadedmetadata", loadedMetadataHandler);
        audioElement.addEventListener("ended", endedHandler);

        return audioElement;
      };

      const timeUpdateHandler = () => {
        if (audioElement) {
          set({ currentTime: audioElement.currentTime });
        }
      };

      const loadedMetadataHandler = () => {
        if (audioElement) {
          set({ duration: audioElement.duration });
        }
      };

      const endedHandler = () => {
        const state = get();
        if (state.isRepeating && state.queueIndex === state.queue.length - 1) {
          // If repeating and at the end, start from beginning
          get().initializeAudio(state.queue, 0);
          get().play();
        } else {
          get().nextSong();
        }
      };

      return {
        currentSong: null,
        isPlaying: false,
        volume: 1,
        currentTime: 0,
        duration: 0,
        queue: [],
        queueIndex: 0,
        isShuffled: false,
        isRepeating: false,
        originalQueue: [],

        initializeAudio: (songs, startIndex) => {
          set({
            queue: songs,
            originalQueue: [...songs],
            queueIndex: startIndex,
            currentSong: songs[startIndex],
            isPlaying: false,
            currentTime: 0,
          });

          setupAudioElement(songs[startIndex]);
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

        toggleShuffle: () => {
          const state = get();
          const currentSong = state.queue[state.queueIndex];

          if (!state.isShuffled) {
            // Shuffle the queue except for the current song
            const remainingSongs = state.queue
              .filter((_, i) => i !== state.queueIndex)
              .sort(() => Math.random() - 0.5);

            const newQueue = [currentSong, ...remainingSongs];

            set({
              queue: newQueue,
              queueIndex: 0,
              isShuffled: true,
            });
          } else {
            // Restore original queue order
            const newIndex = state.originalQueue.findIndex(
              (song) => song._id === currentSong._id
            );
            set({
              queue: [...state.originalQueue],
              queueIndex: newIndex,
              isShuffled: false,
            });
          }
        },

        toggleRepeat: () => {
          set((state) => ({ isRepeating: !state.isRepeating }));
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
          const state = get();
          if (state.queueIndex < state.queue.length - 1) {
            const nextIndex = state.queueIndex + 1;
            const nextSong = state.queue[nextIndex];

            setupAudioElement(nextSong);

            set({
              currentSong: nextSong,
              queueIndex: nextIndex,
              currentTime: 0,
            });

            get().play();
          } else if (state.isRepeating) {
            // If repeating, go back to the first song
            get().initializeAudio(state.queue, 0);
            get().play();
          }
        },

        previousSong: () => {
          const state = get();
          if (state.queueIndex > 0) {
            const previousIndex = state.queueIndex - 1;
            const previousSong = state.queue[previousIndex];

            setupAudioElement(previousSong);

            set({
              currentSong: previousSong,
              queueIndex: previousIndex,
              currentTime: 0,
            });

            get().play();
          }
        },

        addToQueue: (song) => {
          set((state) => ({
            queue: [...state.queue, song],
            originalQueue: [...state.originalQueue, song],
          }));
        },

        removeFromQueue: (index) => {
          const state = get();
          const newQueue = state.queue.filter((_, i) => i !== index);
          set({
            queue: newQueue,
            queueIndex:
              index < state.queueIndex
                ? state.queueIndex - 1
                : state.queueIndex,
          });
        },

        clearQueue: () => {
          if (audioElement) {
            audioElement.pause();
          }
          set({
            queue: [],
            originalQueue: [],
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
        isShuffled: state.isShuffled,
        isRepeating: state.isRepeating,
      }),
    }
  )
);

export function usePlayerControls() {
  const api = Fetcher.getInstance();
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

  return { playSong };
}
