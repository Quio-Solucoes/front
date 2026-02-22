"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeyRound, Mail } from "lucide-react";
import { useTheme } from "@/shared/providers";
import { brandConfig, getBrandLogo } from "@/shared/theme";
import { Button, Card, Input } from "@/shared/ui";
import { useAuthStore } from "../model/auth-store";

export function LoginForm() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Email e senha sao obrigatorios.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      router.replace(next || "/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <Image className="auth-logo" src={getBrandLogo(theme)} alt={brandConfig.appName} priority />
          <p>Acesse seu workspace de orcamentos.</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            <span>
              <Mail size={16} /> Email
            </span>
            <Input
              type="email"
              placeholder="voce@empresa.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>
              <KeyRound size={16} /> Senha
            </span>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
