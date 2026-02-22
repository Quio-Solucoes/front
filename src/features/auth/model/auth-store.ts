"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/entities/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      async login(email, password) {
        if (!email.trim() || !password.trim()) {
          return false;
        }

        const name = email.split("@")[0];
        const user: User = {
          id: crypto.randomUUID(),
          name,
          email,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff`,
        };

        set({ user, isAuthenticated: true });
        return true;
      },
      logout() {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "quio-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
