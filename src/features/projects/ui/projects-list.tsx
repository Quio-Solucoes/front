"use client";

import Link from "next/link";
import { Card } from "@/shared/ui";
import { useProjectsStore } from "../model/projects-store";

export function ProjectsList() {
  const projects = useProjectsStore((state) => state.projects);

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1 className="page-title">Todos os projetos</h1>
          <p className="page-subtitle">Visao consolidada para navegacao rapida.</p>
        </div>
      </header>

      {projects.length === 0 && (
        <Card>
          <p className="page-subtitle">Nenhum projeto disponivel.</p>
        </Card>
      )}

      <div className="project-grid">
        {projects.map((project) => (
          <Card key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.client || "Sem cliente"}</p>
            <small>Status: {project.status}</small>
            <Link className="text-link" href={`/chat/${project.id}`}>
              Abrir conversa
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
