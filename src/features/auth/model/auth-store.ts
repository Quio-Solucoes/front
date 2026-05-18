"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@/entities/user";
import { httpClient } from "@/shared/api/http-client";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  accessToken: string | null;
  expiresAt: number | null;
  login: (email: string, password: string) => Promise<boolean>;
  hydrateUser: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      accessToken: null,
      expiresAt: null,
      setHasHydrated(value) {
        set({ hasHydrated: value });
      },
      async login(email, password) {
        if (!email.trim() || !password.trim()) {
          return false;
        }

        try {
          const tokenResponse = await httpClient.post<{ access_token: string; token_type: string; expires_in: number }>(
            "/auth/login",
            { email, senha: password },
          );

          const accessToken = tokenResponse.data.access_token;
          const expiresIn = tokenResponse.data.expires_in ?? 0;
          const expiresAt = Date.now() + expiresIn * 1000;

          set({ accessToken, expiresAt, isAuthenticated: true });
          await get().hydrateUser();
          return true;
        } catch {
          set({ accessToken: null, expiresAt: null, user: null, isAuthenticated: false });
          return false;
        }
      },
      async hydrateUser() {
        const token = get().accessToken;
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const meResponse = await httpClient.get<{ id: string; nome: string; email: string }>("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const name = meResponse.data.nome || meResponse.data.email.split("@")[0];
          const user: User = {
            id: meResponse.data.id,
            name,
            email: meResponse.data.email,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff`,
          };

          set({ user, isAuthenticated: true });
        } catch {
          set({ accessToken: null, expiresAt: null, user: null, isAuthenticated: false });
        }
      },
      logout() {
        set({ user: null, isAuthenticated: false, accessToken: null, expiresAt: null });
      },
    }),
    {
      name: "quio-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        void state?.hydrateUser();
      },
    },
  ),
);
