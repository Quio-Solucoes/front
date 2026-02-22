import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { AppProviders } from "@/shared/providers";
import { brandConfig, ThemeStyle } from "@/shared/theme";
import "./globals.css";
import "@/shared/ui/styles/primitives.css";
import "@/shared/ui/styles/app-shell.css";
import "@/shared/ui/styles/page.css";
import "@/features/auth/ui/login-form.css";
import "@/features/home/ui/home-dashboard.css";
import "@/features/projects/ui/projects.css";
import "@/features/chat/ui/chat-panel.css";
import "@/features/orcamento/ui/sidebar-orcamento.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: brandConfig.appName,
  description: "CRM de orcamentos para moveis planejados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <ThemeStyle />
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
