"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FolderKanban, Home, LogOut, MessageCircle, Moon, Settings, Sun } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { useTheme } from "@/shared/providers";
import { brandConfig, getBrandLogo } from "@/shared/theme";

type AppShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projetos", icon: FolderKanban },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: Readonly<AppShellProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Image
            className="brand-logo"
            src={getBrandLogo(theme)}
            alt={brandConfig.appName}
            priority
          />
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? " active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Tema claro" : "Tema escuro"}</span>
          </button>

          <div className="user-badge">
            <Image src={user?.avatarUrl ?? ""} alt={user?.name ?? "avatar"} width={34} height={34} />
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
          </div>

          <button
            className="logout"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            type="button"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}
