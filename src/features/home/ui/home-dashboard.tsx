"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, FolderKanban, Plus, Timer, TrendingUp } from "lucide-react";
import { useProjectsStore } from "@/features/projects";
import { Button, Card, Input } from "@/shared/ui";

const MOCK_MONTHLY = [
  { month: "Jan", created: 2 },
  { month: "Fev", created: 4 },
  { month: "Mar", created: 3 },
  { month: "Abr", created: 6 },
  { month: "Mai", created: 5 },
  { month: "Jun", created: 7 },
];

export function HomeDashboard() {
  const router = useRouter();
  const projects = useProjectsStore((state) => state.projects);
  const createProject = useProjectsStore((state) => state.createProject);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");

  const summary = useMemo(() => {
    const done = projects.filter((project) => project.status === "completed").length;
    const inProgress = projects.filter((project) => project.status === "in-progress").length;
    const draft = projects.filter((project) => project.status === "draft").length;
    const completionRate = projects.length === 0 ? 0 : Math.round((done / projects.length) * 100);
    return {
      total: projects.length,
      done,
      inProgress,
      draft,
      completionRate,
    };
  }, [projects]);

  const recentProjects = useMemo(() => projects.slice(0, 5), [projects]);

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral da conta e desempenho dos projetos.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Novo projeto
        </Button>
      </header>

      <section className="home-kpis">
        <Card>
          <div className="home-kpi-head">
            <FolderKanban size={18} />
            <span>Total de projetos</span>
          </div>
          <strong className="home-kpi-value">{summary.total}</strong>
        </Card>
        <Card>
          <div className="home-kpi-head">
            <TrendingUp size={18} />
            <span>Taxa de conclusão</span>
          </div>
          <strong className="home-kpi-value">{summary.completionRate}%</strong>
        </Card>
        <Card>
          <div className="home-kpi-head">
            <Timer size={18} />
            <span>Em andamento</span>
          </div>
          <strong className="home-kpi-value">{summary.inProgress}</strong>
        </Card>
        <Card>
          <div className="home-kpi-head">
            <BarChart3 size={18} />
            <span>Rascunhos</span>
          </div>
          <strong className="home-kpi-value">{summary.draft}</strong>
        </Card>
      </section>

      <section className="home-grid">
        <Card>
          <h2 className="home-section-title">Projetos criados por mês (mock)</h2>
          <div className="home-bars">
            {MOCK_MONTHLY.map((item) => (
              <div key={item.month} className="home-bar-col">
                <div className="home-bar-wrap">
                  <div
                    className="home-bar"
                    style={{ height: `${Math.max(12, item.created * 12)}px` }}
                    aria-label={`${item.created} projetos em ${item.month}`}
                  />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="home-section-title">Projetos recentes</h2>
          {recentProjects.length === 0 ? (
            <p className="page-subtitle">Nenhum projeto criado ainda.</p>
          ) : (
            <div className="home-recent-list">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  className="home-recent-item"
                  onClick={() => router.push(`/chat/${project.id}`)}
                  type="button"
                >
                  <div>
                    <strong>{project.name}</strong>
                    <p>{project.client || "Sem cliente"}</p>
                  </div>
                  <span>{project.status}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </section>

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
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
