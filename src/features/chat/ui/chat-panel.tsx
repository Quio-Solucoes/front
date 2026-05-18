"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Layers } from "lucide-react";
import { SidebarOrcamento } from "@/features/orcamento";
import { Button, Card, Input } from "@/shared/ui";
import { ProductConfigurator, type ItemEmEdicao } from "./product-configurator";
import { getOrcamento, mapOrcamentoToProject, updateOrcamento } from "@/features/projects/api/orcamentos-api";
import { useOrcamentos } from "@/features/projects";

type ChatPanelProps = {
  projectId: string;
};

const VISTAS = [
  { id: "frontal", label: "Vista A" },
  { id: "lateral_esq", label: "Vista B" },
  { id: "lateral_dir", label: "Vista C" },
  { id: "fundos", label: "Vista D" },
  { id: "interna", label: "Teto" },
];

export function ChatPanel({ projectId }: Readonly<ChatPanelProps>) {
  const { suggestions } = useOrcamentos();

  const [project, setProject] = useState<ReturnType<typeof mapOrcamentoToProject> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEnv, setLoadingEnv] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(true);
  const [vistaAtual, setVistaAtual] = useState("frontal");
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemEmEdicao>(null);
  const [ambiente, setAmbiente] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const dto = await getOrcamento(projectId);
        if (cancelled) return;
        setProject(mapOrcamentoToProject(dto));
      } catch (err) {
        if (cancelled) return;
        setProject(null);
        setError(err instanceof Error ? err.message : "Falha ao carregar orçamento");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const environmentSuggestions = useMemo(() => {
    const base = suggestions.environments;
    const defaults = ["Cozinha", "Sala", "Quarto", "Banheiro", "Escritório", "Lavanderia"];
    return Array.from(new Set([...base, ...defaults])).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [suggestions.environments]);

  const hasEnvironment = Boolean(project?.environment?.trim());

  return (
    <div className={`chat-with-orcamento${isOrcamentoOpen ? "" : " collapsed"}`}>
      <div className="stack">
        <header className="page-header chat-page-header">
          <div className="chat-header-info">
            <Bot size={22} />
            <div>
              <h1 className="page-title">Orçamento</h1>
              <p className="page-subtitle">
                {project
                  ? [project.client ? `Cliente: ${project.client}` : null, project.architect ? `Arquiteto: ${project.architect}` : null]
                      .filter(Boolean)
                      .join(" • ") || "Orçamento"
                  : loading
                    ? "Carregando orçamento..."
                    : "Orçamento"}
              </p>
              <span className="chat-status">{hasEnvironment ? `Ambiente: ${project?.environment}` : "Defina o ambiente para começar"}</span>
            </div>
          </div>

          {project && hasEnvironment && (
            <div className="vista-selector" aria-label="Selecionar vista">
              <Layers size={14} />
              <span className="vista-label">Vista:</span>

              <nav className="vista-nav" aria-label="Vistas">
                {VISTAS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`vista-tab${vistaAtual === v.id ? " active" : ""}`}
                    onClick={() => setVistaAtual(v.id)}
                    aria-pressed={vistaAtual === v.id}
                  >
                    {v.label}
                  </button>
                ))}
              </nav>

              <select value={vistaAtual} onChange={(e) => setVistaAtual(e.target.value)} className="vista-select vista-select--mobile">
                {VISTAS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        {error && (
          <Card>
            <h2 className="page-title">Erro</h2>
            <p className="page-subtitle">{error}</p>
          </Card>
        )}

        {!loading && !project ? (
          <Card>
            <h2 className="page-title">Orçamento não encontrado</h2>
            <p className="page-subtitle">Volte para orçamentos e crie um novo.</p>
          </Card>
        ) : project && !hasEnvironment ? (
          <Card className="environment-card">
            <h2 className="page-title">Qual ambiente vamos orçar?</h2>
            <p className="page-subtitle">Ex.: Cozinha, Sala, Quarto, Escritório.</p>

            <form
              className="environment-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const value = ambiente.trim();
                if (!value) return;

                setLoadingEnv(true);
                try {
                  const updated = await updateOrcamento(projectId, { ambiente: value });
                  setProject(mapOrcamentoToProject(updated));
                  setAmbiente("");
                  setError(null);
                  window.dispatchEvent(new CustomEvent("orcamentos:refresh"));
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Falha ao salvar ambiente");
                } finally {
                  setLoadingEnv(false);
                }
              }}
            >
              <Input
                placeholder="Digite o ambiente"
                value={ambiente}
                onChange={(event) => setAmbiente(event.target.value)}
                list="environment-suggestions"
                disabled={loadingEnv}
              />
              <datalist id="environment-suggestions">
                {environmentSuggestions.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
              <div className="environment-actions">
                <Button type="submit" disabled={loadingEnv}>
                  {loadingEnv ? "Salvando..." : "Continuar"}
                </Button>
              </div>
            </form>
          </Card>
        ) : project ? (
          <ProductConfigurator
            sessionId={projectId}
            vistaAtual={vistaAtual}
            itemEmEdicao={itemEmEdicao}
            onEdicaoConcluida={() => setItemEmEdicao(null)}
          />
        ) : (
          <Card>
            <p className="page-subtitle">Carregando...</p>
          </Card>
        )}
      </div>

      {project && hasEnvironment && (
        <SidebarOrcamento
          sessionId={projectId}
          open={isOrcamentoOpen}
          onToggle={() => setIsOrcamentoOpen((prev) => !prev)}
          onStartEdit={(payload) => setItemEmEdicao(payload)}
        />
      )}
    </div>
  );
}
