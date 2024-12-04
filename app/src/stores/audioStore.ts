import { type Song } from "@/features/songs/dashboard/view";
import Fetcher from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerMode {
  isExpanded: boolean;
  isVisible: boolean;
  isMiniPlayer: boolean;
}

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
  originalQueue: Song[];
  playerMode: PlayerMode;
  bufferedTime: number;
  isBuffering: boolean;

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
  setPlayerMode: (mode: Partial<PlayerMode>) => void;
  playQueueItem: (index: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => {
      let audioElement: HTMLAudioElement | null = null;

      const setupAudioElement = (song: Song) => {
        if (audioElement) {
          audioElement.pause();
          audioElement.src = "";
          audioElement.removeEventListener("timeupdate", timeUpdateHandler);
          audioElement.removeEventListener(
            "loadedmetadata",
            loadedMetadataHandler
          );
          audioElement.removeEventListener("ended", endedHandler);
          audioElement.removeEventListener("progress", progressHandler);
          audioElement.removeEventListener("waiting", bufferingHandler);
          audioElement.removeEventListener("playing", playingHandler);
        }

        audioElement = new Audio(song.stream_url);
        audioElement.volume = get().volume;
        audioElement.preload = "auto";

        audioElement.addEventListener("timeupdate", timeUpdateHandler);
        audioElement.addEventListener("loadedmetadata", loadedMetadataHandler);
        audioElement.addEventListener("ended", endedHandler);
        audioElement.addEventListener("progress", progressHandler);
        audioElement.addEventListener("waiting", bufferingHandler);
        audioElement.addEventListener("playing", playingHandler);

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

      const progressHandler = () => {
        if (audioElement && audioElement.buffered.length > 0) {
          set({
            bufferedTime: audioElement.buffered.end(
              audioElement.buffered.length - 1
            ),
          });
        }
      };

      const bufferingHandler = () => {
        set({ isBuffering: true });
      };

      const playingHandler = () => {
        set({ isBuffering: false });
      };

      const endedHandler = () => {
        const state = get();
        if (state.isRepeating && state.queueIndex === state.queue.length - 1) {
          get().playQueueItem(0);
        } else if (state.queueIndex < state.queue.length - 1) {
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
        playerMode: {
          isExpanded: false,
          isVisible: true,
          isMiniPlayer: true,
        },
        bufferedTime: 0,
        isBuffering: false,

        initializeAudio: (songs, startIndex) => {
          set({
            queue: songs,
            originalQueue: [...songs],
            queueIndex: startIndex,
            currentSong: songs[startIndex],
            isPlaying: false,
            currentTime: 0,
            playerMode: {
              ...get().playerMode,
              isVisible: true,
            },
          });

          setupAudioElement(songs[startIndex]);
        },

        playQueueItem: (index: number) => {
          const state = get();
          const song = state.queue[index];
          if (!song) return;

          setupAudioElement(song);
          set({
            currentSong: song,
            queueIndex: index,
            currentTime: 0,
            isPlaying: true,
          });
          audioElement?.play();
        },

        play: () => {
          if (audioElement) {
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                set({ isPlaying: false });
              });
            }
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
            get().playQueueItem(state.queueIndex + 1);
          } else if (state.isRepeating) {
            get().playQueueItem(0);
          }
        },

        previousSong: () => {
          const state = get();
          if (state.currentTime > 3) {
            get().seek(0);
          } else if (state.queueIndex > 0) {
            get().playQueueItem(state.queueIndex - 1);
          } else {
            get().seek(0);
          }
        },

        addToQueue: (song) => {
          set((state) => ({
            queue: [...state.queue, song],
            originalQueue: [...state.originalQueue, song],
          }));
        },

        removeFromQueue: (index) => {
          set((state) => {
            const newQueue = [...state.queue];
            newQueue.splice(index, 1);

            const newOriginalQueue = [...state.originalQueue];
            newOriginalQueue.splice(index, 1);

            return {
              queue: newQueue,
              originalQueue: newOriginalQueue,
              queueIndex:
                index < state.queueIndex
                  ? state.queueIndex - 1
                  : state.queueIndex,
            };
          });
        },

        clearQueue: () => {
          if (audioElement) {
            audioElement.pause();
            audioElement.src = "";
          }
          set({
            queue: [],
            originalQueue: [],
            queueIndex: 0,
            currentSong: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            playerMode: {
              isExpanded: false,
              isVisible: false,
              isMiniPlayer: true,
            },
          });
        },

        setPlayerMode: (mode) => {
          set((state) => ({
            playerMode: {
              ...state.playerMode,
              ...mode,
            },
          }));
        },
      };
    },
    {
      name: "audio-storage",
      partialize: (state) => ({
        volume: state.volume,
        isShuffled: state.isShuffled,
        isRepeating: state.isRepeating,
        playerMode: state.playerMode,
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
