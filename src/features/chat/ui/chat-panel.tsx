"use client";

import { useMemo, useState } from "react";
import { Bot, Layers } from "lucide-react";
import { SidebarOrcamento } from "@/features/orcamento";
import { useProjectsStore } from "@/features/projects";
import { Button, Card, Input } from "@/shared/ui";
import { ProductConfigurator, type ItemEmEdicao } from "./product-configurator";

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
  const projects = useProjectsStore((state) => state.projects);
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);
  const setProjectEnvironment = useProjectsStore((state) => state.setProjectEnvironment);
  const environmentSuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((p) => p.environment)
            .filter((v): v is string => Boolean(v && v.trim())),
        ),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [projects],
  );

  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(true);
  const [vistaAtual, setVistaAtual] = useState("frontal");
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemEmEdicao>(null);
  const [ambiente, setAmbiente] = useState("");

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
                      .join(" • ") || "Conversa"
                  : "Carregando conversa..."}
              </p>
              <span className="chat-status">{hasEnvironment ? `Ambiente: ${project?.environment}` : "Defina o ambiente para começar"}</span>
            </div>
          </div>

          {hasEnvironment && (
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

              <select
                value={vistaAtual}
                onChange={(e) => setVistaAtual(e.target.value)}
                className="vista-select vista-select--mobile"
              >
                {VISTAS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        {!project ? (
          <Card>
            <h2 className="page-title">Conversa não encontrada</h2>
            <p className="page-subtitle">Volte para projetos e crie uma nova conversa.</p>
          </Card>
        ) : !hasEnvironment ? (
          <Card className="environment-card">
            <h2 className="page-title">Qual ambiente vamos orçar?</h2>
            <p className="page-subtitle">Ex.: Cozinha, Sala, Quarto, Escritório.</p>

            <form
              className="environment-form"
              onSubmit={(event) => {
                event.preventDefault();
                setProjectEnvironment(projectId, ambiente);
                setAmbiente("");
              }}
            >
              <Input
                placeholder="Digite o ambiente"
                value={ambiente}
                onChange={(event) => setAmbiente(event.target.value)}
                list="environment-suggestions"
              />
              <datalist id="environment-suggestions">
                {environmentSuggestions.map((value) => (
                  <option key={value} value={value} />
                ))}
                {["Cozinha", "Sala", "Quarto", "Banheiro", "Escritório", "Lavanderia"].map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
              <div className="environment-actions">
                <Button type="submit">Continuar</Button>
              </div>
            </form>
          </Card>
        ) : (
          <ProductConfigurator
            sessionId={projectId}
            vistaAtual={vistaAtual}
            itemEmEdicao={itemEmEdicao}
            onEdicaoConcluida={() => setItemEmEdicao(null)}
          />
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
