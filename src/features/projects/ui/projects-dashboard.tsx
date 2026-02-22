"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button, Card, Input } from "@/shared/ui";
import { useProjectsStore } from "../model/projects-store";

export function ProjectsDashboard() {
  const router = useRouter();
  const projects = useProjectsStore((state) => state.projects);
  const createProject = useProjectsStore((state) => state.createProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");

  const totals = useMemo(
    () => ({
      all: projects.length,
      done: projects.filter((project) => project.status === "completed").length,
    }),
    [projects],
  );

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projetos</h1>
          <p className="page-subtitle">Crie, acompanhe e abra conversas por projeto.</p>
        </div>
        <div className="page-header-actions">
          <div className="kpis">
            <span>{totals.all} ativos</span>
            <span>{totals.done} concluidos</span>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} />
            Criar
          </Button>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="empty-projects-state">
          <Card>
            <p className="page-subtitle">Sem projetos ainda. Crie o primeiro para iniciar.</p>
          </Card>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <Card key={project.id}>
              <h3>{project.name}</h3>
              <p>{project.client || "Sem cliente"}</p>
              <small>{new Date(project.createdAt).toLocaleDateString("pt-BR")}</small>
              <div className="row-actions">
                <Button onClick={() => router.push(`/chat/${project.id}`)}>Abrir chat</Button>
                <Button variant="danger" onClick={() => deleteProject(project.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)} role="presentation">
          <Card className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2 className="page-title">Novo projeto</h2>
            <p className="page-subtitle">Preencha os dados para criar um projeto.</p>

            <form
              className="stack"
              onSubmit={(event) => {
                event.preventDefault();
                const created = createProject({ name, client });
                if (!created) return;
                setName("");
                setClient("");
                setIsCreateOpen(false);
              }}
            >
              <Input
                placeholder="Nome do projeto"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Input
                placeholder="Cliente (opcional)"
                value={client}
                onChange={(event) => setClient(event.target.value)}
              />
              <div className="modal-actions">
                <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
