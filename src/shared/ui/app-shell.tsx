"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FolderKanban,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { useTheme } from "@/shared/providers";
import { brandConfig, getBrandLogo, getBrandLogoMin } from "@/shared/theme";

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

  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const sync = (matches: boolean) => {
      setIsMobile(matches);
      if (!matches) setIsMobileMenuOpen(false);
    };

    sync(media.matches);

    const onChange = (event: MediaQueryListEvent) => sync(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isSidebarCollapsedDesktop = !isMobile && !isSidebarExpanded;
  const isSidebarVisible = isMobile ? isMobileMenuOpen : true;

  const toggleMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen((prev) => !prev);
      return;
    }

    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div
      className={[
        "app-shell",
        isSidebarCollapsedDesktop ? "sidebar-collapsed" : "",
        isMobileMenuOpen ? "mobile-menu-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className={`sidebar${isSidebarVisible ? "" : " hidden"}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-menu-button"
            onClick={toggleMenu}
            type="button"
            aria-label={
              isMobile
                ? isMobileMenuOpen
                  ? "Fechar menu principal"
                  : "Abrir menu principal"
                : isSidebarExpanded
                  ? "Recolher menu principal"
                  : "Expandir menu principal"
            }
            aria-expanded={isMobile ? isMobileMenuOpen : isSidebarExpanded}
          >
            <Menu size={18} />
          </button>

          <div className="brand">
            <Image
              className={`brand-logo${isSidebarCollapsedDesktop ? " is-min" : ""}`}
              src={isSidebarCollapsedDesktop ? getBrandLogoMin(theme) : getBrandLogo(theme)}
              alt={brandConfig.appName}
              priority
            />
          </div>
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
                title={isSidebarCollapsedDesktop ? item.label : undefined}
                onClick={() => {
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            title={isSidebarCollapsedDesktop ? (theme === "dark" ? "Tema claro" : "Tema escuro") : undefined}
          >
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
            title={isSidebarCollapsedDesktop ? "Sair" : undefined}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-main-toolbar">
          <button
            className="sidebar-toggle-button"
            onClick={toggleMenu}
            type="button"
            aria-label={
              isMobile
                ? isMobileMenuOpen
                  ? "Fechar menu principal"
                  : "Abrir menu principal"
                : isSidebarExpanded
                  ? "Recolher menu principal"
                  : "Expandir menu principal"
            }
            aria-expanded={isMobile ? isMobileMenuOpen : isSidebarExpanded}
          >
            <Menu size={18} />
            <span>{isMobile ? "Menu" : isSidebarExpanded ? "Recolher menu" : "Expandir menu"}</span>
          </button>

          <div className="app-main-brand-mobile" aria-hidden={!isMobile}>
            <Image className="brand-logo" src={getBrandLogo(theme)} alt={brandConfig.appName} priority />
          </div>
        </div>

        {isMobile && isMobileMenuOpen && (
          <button
            className="sidebar-backdrop"
            type="button"
            aria-label="Fechar menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {children}
      </main>
    </div>
  );
}
