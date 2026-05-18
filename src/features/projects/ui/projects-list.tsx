"use client";

import Link from "next/link";
import { Card } from "@/shared/ui";
import { useOrcamentos } from "../model/use-orcamentos";

export function ProjectsList() {
  const { projects, loading, error } = useOrcamentos();

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1 className="page-title">Todos os orçamentos</h1>
          <p className="page-subtitle">Visão consolidada para navegação rápida.</p>
        </div>
      </header>

      {error && (
        <Card>
          <p className="page-subtitle">{error}</p>
        </Card>
      )}

      {loading ? (
        <Card>
          <p className="page-subtitle">Carregando orçamentos...</p>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <p className="page-subtitle">Nenhum orçamento disponível.</p>
        </Card>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <Card key={project.id}>
              <h3>{project.client || project.name}</h3>
              <p>{project.architect ? `Arquiteto: ${project.architect}` : "Sem arquiteto"}</p>
              <p>{project.environment ? `Ambiente: ${project.environment}` : "Ambiente: não definido"}</p>
              <small>Status: {project.status}</small>
              <Link className="text-link" href={`/orcamentos/${project.id}`}>
                Abrir orçamento
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

