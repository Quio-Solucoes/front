"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button, Card, Input } from "@/shared/ui";
import { useOrcamentos } from "../model/use-orcamentos";

type GroupBy = "cliente" | "arquiteto" | "ambiente";

function normalizeKey(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function buildGroupLabel(groupBy: GroupBy, key: string): string {
  if (groupBy === "cliente") return `Cliente: ${key}`;
  if (groupBy === "arquiteto") return `Arquiteto: ${key}`;
  return `Ambiente: ${key}`;
}

export function OrcamentosExplorer() {
  const router = useRouter();
  const { projects, createProject, deleteProject, loading, error, suggestions } = useOrcamentos();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [architect, setArchitect] = useState("");
  const [client, setClient] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("cliente");
  const [openedGroupKey, setOpenedGroupKey] = useState<string | null>(null);

  const totals = useMemo(
    () => ({
      all: projects.length,
      done: projects.filter((project) => project.status === "completed").length,
    }),
    [projects],
  );

  const groups = useMemo(() => {
    const missingLabel =
      groupBy === "cliente" ? "Sem cliente" : groupBy === "arquiteto" ? "Sem arquiteto" : "Sem ambiente";

    const grouped = new Map<string, typeof projects>();
    for (const project of projects) {
      const key =
        groupBy === "cliente"
          ? normalizeKey(project.client, missingLabel)
          : groupBy === "arquiteto"
            ? normalizeKey(project.architect, missingLabel)
            : normalizeKey(project.environment, missingLabel);

      const existing = grouped.get(key);
      if (existing) existing.push(project);
      else grouped.set(key, [project]);
    }

    const keys = Array.from(grouped.keys()).sort((a, b) => {
      if (a === missingLabel && b !== missingLabel) return 1;
      if (b === missingLabel && a !== missingLabel) return -1;
      return a.localeCompare(b, "pt-BR");
    });

    return keys.map((key) => ({
      key,
      label: buildGroupLabel(groupBy, key),
      projects: grouped.get(key) ?? [],
    }));
  }, [groupBy, projects]);

  const activeGroup = useMemo(() => {
    if (!openedGroupKey) return null;
    return groups.find((g) => g.key === openedGroupKey) ?? null;
  }, [groups, openedGroupKey]);

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1 className="page-title">Orçamentos</h1>
          <p className="page-subtitle">Organize por cliente, arquiteto ou ambiente e abra o assistente para preencher os itens.</p>
        </div>
        <div className="page-header-actions">
          <div className="kpis">
            <span>{totals.all} ativos</span>
            <span>{totals.done} concluidos</span>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} />
            Novo orçamento
          </Button>
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
        <div className="empty-projects-state">
          <Card>
            <p className="page-subtitle">Sem orçamentos ainda. Crie o primeiro para começar.</p>
          </Card>
        </div>
      ) : (
        <div className="orcamentos-explorer">
          <div className="orcamentos-toolbar" aria-label="Organizar orçamentos">
            <span className="orcamentos-toolbar-label">Organizar por:</span>
            <div className="orcamentos-toolbar-tabs" role="tablist" aria-label="Agrupamento">
              <button
                type="button"
                className={`orcamentos-tab${groupBy === "cliente" ? " active" : ""}`}
                onClick={() => {
                  setOpenedGroupKey(null);
                  setGroupBy("cliente");
                }}
                role="tab"
                aria-selected={groupBy === "cliente"}
              >
                Cliente
              </button>
              <button
                type="button"
                className={`orcamentos-tab${groupBy === "arquiteto" ? " active" : ""}`}
                onClick={() => {
                  setOpenedGroupKey(null);
                  setGroupBy("arquiteto");
                }}
                role="tab"
                aria-selected={groupBy === "arquiteto"}
              >
                Arquiteto
              </button>
              <button
                type="button"
                className={`orcamentos-tab${groupBy === "ambiente" ? " active" : ""}`}
                onClick={() => {
                  setOpenedGroupKey(null);
                  setGroupBy("ambiente");
                }}
                role="tab"
                aria-selected={groupBy === "ambiente"}
              >
                Ambiente
              </button>
            </div>
          </div>

          <div className="orcamentos-groups">
            {openedGroupKey && activeGroup ? (
              <>
                <div className="orcamentos-breadcrumb">
                  <button type="button" className="orcamentos-back" onClick={() => setOpenedGroupKey(null)}>
                    Voltar
                  </button>
                  <span className="orcamentos-crumb">{activeGroup.label}</span>
                  <span className="orcamentos-group-badge" aria-label={`${activeGroup.projects.length} orçamentos`}>
                    {activeGroup.projects.length} orçamentos
                  </span>
                </div>

                <div className="project-grid">
                  {activeGroup.projects.map((project) => (
                    <Card key={project.id}>
                      <h3>{project.client || project.name}</h3>
                      <p>{project.architect ? `Arquiteto: ${project.architect}` : "Sem arquiteto"}</p>
                      <p>{project.environment ? `Ambiente: ${project.environment}` : "Ambiente: não definido"}</p>
                      <small>{new Date(project.createdAt).toLocaleDateString("pt-BR")}</small>
                      <div className="row-actions">
                        <Button onClick={() => router.push(`/orcamentos/${project.id}`)}>Abrir orçamento</Button>
                        <Button
                          variant="danger"
                          onClick={() => void deleteProject(project.id)}
                          aria-label="Excluir orçamento"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="project-grid">
                {groups.map((group) => (
                  <button
                    key={group.key}
                    type="button"
                    className="orcamentos-folder-card"
                    onClick={() => setOpenedGroupKey(group.key)}
                  >
                    <div className="orcamentos-folder-badge" aria-label={`${group.projects.length} orçamentos`}>
                      {group.projects.length} orç.
                    </div>
                    <h3 className="orcamentos-folder-title">{group.key}</h3>
                    <p className="orcamentos-folder-subtitle">Ver orçamentos</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)} role="presentation">
          <Card className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2 className="page-title">Novo orçamento</h2>
            <p className="page-subtitle">Informe cliente e arquiteto. O ambiente pode ser definido ao abrir o orçamento.</p>

            <form
              className="stack"
              onSubmit={async (event) => {
                event.preventDefault();
                const created = await createProject({ arquiteto: architect, cliente: client });
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
                list="architect-suggestions"
              />
              <Input
                placeholder="Cliente"
                value={client}
                onChange={(event) => setClient(event.target.value)}
                list="client-suggestions"
              />
              <datalist id="architect-suggestions">
                {suggestions.architects.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
              <datalist id="client-suggestions">
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

export const ProjectsDashboard = OrcamentosExplorer;

