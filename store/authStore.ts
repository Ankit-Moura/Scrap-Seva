// store/authStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  phone_number: string;
  username: string | null;
  email: string | null;
  phone_verified: boolean;
  created_at: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthState {
  user: AuthUser | null;
  tokens: Tokens | null;
  loading: boolean;

  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: Tokens | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      loading: true,

      setUser: (user) => set({ user }),
      setTokens: (tokens) => set({ tokens }),
      setLoading: (loading) => set({ loading }),

      logout: () => set({ user: null, tokens: null }),
    }),
    {
      name: "scrapseva-auth", // localStorage key
      partialize: (state) => ({ user: state.user, tokens: state.tokens }), // don't persist `loading`
      skipHydration: true,
    }
  )
);