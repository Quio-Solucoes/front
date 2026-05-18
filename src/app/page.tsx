"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";

export default function RootPage() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated) {
      router.replace("/orcamentos");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("quio_auth_next", "/orcamentos");
    }

    router.replace("/login");
  }, [hasHydrated, isAuthenticated, router]);

  return null;
}
