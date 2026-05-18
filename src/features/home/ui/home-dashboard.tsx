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
  const [architect, setArchitect] = useState("");
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

  const suggestions = useMemo(() => {
    const architects = Array.from(
      new Set(projects.map((p) => p.architect).filter((v): v is string => Boolean(v && v.trim()))),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));

    const clients = Array.from(
      new Set(projects.map((p) => p.client).filter((v): v is string => Boolean(v && v.trim()))),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));

    return { architects, clients };
  }, [projects]);

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral da conta e desempenho dos orçamentos.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Novo orçamento
        </Button>
      </header>

      <section className="home-kpis">
        <Card>
          <div className="home-kpi-head">
            <FolderKanban size={18} />
            <span>Total de orçamentos</span>
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
          <h2 className="home-section-title">Orçamentos criados por mês (mock)</h2>
          <div className="home-bars">
            {MOCK_MONTHLY.map((item) => (
              <div key={item.month} className="home-bar-col">
                <div className="home-bar-wrap">
                  <div
                    className="home-bar"
                    style={{ height: `${Math.max(12, item.created * 12)}px` }}
                    aria-label={`${item.created} orçamentos em ${item.month}`}
                  />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="home-section-title">Orçamentos recentes</h2>
          {recentProjects.length === 0 ? (
            <p className="page-subtitle">Nenhum orçamento criado ainda.</p>
          ) : (
            <div className="home-recent-list">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  className="home-recent-item"
                  onClick={() => router.push(`/orcamentos/${project.id}`)}
                  type="button"
                >
                  <div>
                    <strong>{project.client || project.name}</strong>
                    <p>{project.architect ? `Arquiteto: ${project.architect}` : "Sem arquiteto"}</p>
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
            <h2 className="page-title">Novo orçamento</h2>
            <p className="page-subtitle">Informe cliente e arquiteto. O ambiente pode ser definido ao abrir o orçamento.</p>

            <form
              className="stack"
              onSubmit={(event) => {
                event.preventDefault();
                const created = createProject({ architect, client });
                if (!created) return;
                setArchitect("");
                setClient("");
                setIsCreateOpen(false);
                router.push(`/orcamentos/${created.id}`);
              }}
            >
              <Input
                placeholder="Arquiteto"
                value={architect}
                onChange={(event) => setArchitect(event.target.value)}
                list="architect-suggestions-home"
              />
              <Input
                placeholder="Cliente"
                value={client}
                onChange={(event) => setClient(event.target.value)}
                list="client-suggestions-home"
              />
              <datalist id="architect-suggestions-home">
                {suggestions.architects.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
              <datalist id="client-suggestions-home">
                {suggestions.clients.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
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

