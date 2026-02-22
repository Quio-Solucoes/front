"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjectsStore } from "@/features/projects";
import { Button, Card } from "@/shared/ui";

export default function ChatIndexPage() {
  const router = useRouter();
  const projects = useProjectsStore((state) => state.projects);
  const hasHydrated = useProjectsStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (projects.length === 0) return;
    router.replace(`/chat/${projects[0].id}`);
  }, [hasHydrated, projects, router]);

  if (!hasHydrated) {
    return (
      <Card>
        <h1 className="page-title">Carregando chat</h1>
        <p className="page-subtitle">Aguarde enquanto sincronizamos seus projetos.</p>
      </Card>
    );
  }

  if (projects.length > 0) {
    return (
      <Card>
        <h1 className="page-title">Abrindo conversa</h1>
        <p className="page-subtitle">Redirecionando para o último projeto.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="page-title">Nenhum projeto disponível</h1>
      <p className="page-subtitle">Crie um projeto para iniciar uma conversa no chat.</p>
      <Button onClick={() => router.push("/projects")}>Ir para projetos</Button>
    </Card>
  );
}
