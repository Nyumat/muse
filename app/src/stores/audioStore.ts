import { Playlist } from "@/features/playlists/nested";
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
  // Playback state
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  isBuffering: boolean;
  volume: number;

  // Queue state
  queue: Song[];
  queueIndex: number;
  originalQueue: Song[];
  isShuffled: boolean;
  isRepeating: boolean;

  // Context state
  currentPlaylist: Playlist | null;
  playerMode: PlayerMode;

  // Methods
  initializeAudio: (songs: Song[], startIndex: number, playlist?: Playlist | null) => void;
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
          audioElement.removeEventListener("loadedmetadata", loadedMetadataHandler);
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
        if (audioElement) set({ currentTime: audioElement.currentTime });
      };

      const loadedMetadataHandler = () => {
        if (audioElement) set({ duration: audioElement.duration });
      };

      const progressHandler = () => {
        if (audioElement) {
          const buffered = audioElement.buffered;
          if (buffered.length > 0) {
            set({ bufferedTime: buffered.end(0) });
          }
        }
      };

      const bufferingHandler = () => set({ isBuffering: true });
      const playingHandler = () => set({ isBuffering: false });

      const endedHandler = () => {
        const state = get();
        if (state.isRepeating && state.queueIndex === state.queue.length - 1) {
          get().playQueueItem(0);
        } else if (state.queueIndex < state.queue.length - 1) {
          get().nextSong();
        }
      };

      return {
        // Initial state
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        bufferedTime: 0,
        isBuffering: false,
        volume: 1,
        queue: [],
        queueIndex: 0,
        originalQueue: [],
        isShuffled: false,
        isRepeating: false,
        currentPlaylist: null,
        playerMode: {
          isExpanded: false,
          isVisible: true,
          isMiniPlayer: true,
        },

        // Methods
          initializeAudio: (songs, startIndex, playlist = null) => {
          set({
            queue: songs,
            originalQueue: [...songs],
            queueIndex: startIndex,
            currentSong: songs[startIndex],
            currentPlaylist: playlist,
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
              playPromise.catch(() => set({ isPlaying: false }));
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
          const sourceSongs = state.currentPlaylist?.songs || state.originalQueue;

          if (!state.isShuffled) {
            const remainingSongs = sourceSongs
              .filter(song => song._id !== currentSong._id)
              .sort(() => Math.random() - 0.5);

            set({
              queue: [currentSong, ...remainingSongs],
              queueIndex: 0,
              isShuffled: true,
            });
          } else {
            const newIndex = sourceSongs.findIndex(song => song._id === currentSong._id);
            set({
              queue: [...sourceSongs],
              queueIndex: newIndex,
              isShuffled: false,
            });
          }
        },

        toggleRepeat: () => set(state => ({ isRepeating: !state.isRepeating })),

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
          set(state => ({
            queue: [...state.queue, song],
            originalQueue: [...state.originalQueue, song],
          }));
        },

        removeFromQueue: (index) => {
          set(state => {
            const newQueue = [...state.queue];
            const newOriginalQueue = [...state.originalQueue];
            newQueue.splice(index, 1);
            newOriginalQueue.splice(index, 1);

            return {
              queue: newQueue,
              originalQueue: newOriginalQueue,
              queueIndex: index < state.queueIndex ? state.queueIndex - 1 : state.queueIndex,
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
            currentPlaylist: null,
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
          set(state => ({
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
  const { data: allSongs } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await api.get<Song[]>("/api/songs");
      return res.data;
    },
  });

  const store = useAudioStore();

  const playSong = async (songId: string, playlistId?: string) => {
    try {
      // If we're playing from a playlist, fetch it first
      if (playlistId) {
        const { data: playlist } = await api.get<Playlist>(`/api/playlists/${playlistId}`);
        const songIndex = playlist.songs.findIndex(song => song._id === songId);

        if (songIndex !== -1) {
          if (store.currentSong?._id === songId) {
            // If the same song is already playing, just toggle play/pause
            store.playPause();
          } else {
            // Initialize with playlist songs and start playing
            store.initializeAudio(playlist.songs, songIndex, playlist);
            store.play();
          }
          return;
        }
      }

      // Fall back to all songs if not in a playlist or playlist fetch failed
      if (!allSongs) return;
      const songIndex = allSongs.findIndex(song => song._id === songId);
      if (songIndex === -1) return;

      if (store.currentSong?._id === songId) {
        // If the same song is already playing, just toggle play/pause
        store.playPause();
      } else {
        // Initialize with all songs and start playing
        store.initializeAudio(allSongs, songIndex, null);
        store.play();
      }
    } catch (error) {
      console.error('Error playing song:', error);
      // Fall back to all songs if there was an error
      if (!allSongs) return;
      const songIndex = allSongs.findIndex(song => song._id === songId);
      if (songIndex === -1) return;

      if (store.currentSong?._id === songId) {
        store.playPause();
      } else {
        store.initializeAudio(allSongs, songIndex, null);
        store.play();
      }
    }
  };

  return { playSong };
}