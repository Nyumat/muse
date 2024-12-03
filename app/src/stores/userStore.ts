import Fetcher from "@/lib/fetcher";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const api = Fetcher.getInstance();

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
}

interface UserState {
  token: string | null;
  user: User | null;
}

interface UserActions {
  setToken: (token: string) => void;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setToken: (token: string) => {
        set({ token });
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) {
          console.error("Token is missing. Cannot fetch user.");
          return;
        }

        try {
          const response = await api.get<User>("/auth/user");
          set({ user: response.data });
        } catch (error) {
          console.error("Failed to fetch user:", error);
          set({ user: null, token: null });
        }
      },

      clearUser: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
