"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import { AppShell } from "@/shared/ui";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const nextPath = pathname?.trim();
        if (nextPath && nextPath !== "/login") {
          window.sessionStorage.setItem("quio_auth_next", nextPath);
        }
      }

      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  return <AppShell>{children}</AppShell>;
}
