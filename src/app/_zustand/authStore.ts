import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string | null;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

type AuthActions = {
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // unique key
      storage: createJSONStorage(() => sessionStorage), // or localStorage if you prefer
    }
  )
);
