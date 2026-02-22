"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/ui";
import { useOrcamento } from "../model/use-orcamento";
import { OpcaoComponente } from "../model/orcamento-types";

type SidebarOrcamentoProps = {
  sessionId: string;
  open: boolean;
  onToggle: () => void;
};

type OpcaoAberta = {
  movelId: number;
  componenteId: number;
  opcoes: OpcaoComponente[];
} | null;

function resolvePdfUrl(baseUrl: string | null, sessionId: string): string | null {
  if (!baseUrl) return null;
  return `${baseUrl.replace(/\/$/, "")}/download-pdf/${encodeURIComponent(sessionId)}`;
}

export function SidebarOrcamento({ sessionId, open, onToggle }: Readonly<SidebarOrcamentoProps>) {
  const {
    moveis,
    total,
    finalizado,
    backendBaseUrl,
    loading,
    removerMovelOrcado,
    obterOpcoes,
    atualizarOpcao,
  } = useOrcamento(sessionId);

  const [movelAberto, setMovelAberto] = useState<number | null>(null);
  const [opcoesAbertas, setOpcoesAbertas] = useState<OpcaoAberta>(null);

  const pdfUrl = resolvePdfUrl(backendBaseUrl, sessionId);

  return (
    <aside className={`orcamento-sidebar ${open ? "open" : "closed"}`}>
      <div className="orcamento-header">
        {open && <h3>Móveis Orçados</h3>}
        <button
          className="orcamento-toggle"
          onClick={onToggle}
          type="button"
          aria-label={open ? "Fechar orçamento" : "Abrir orçamento"}
        >
          {open ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {open && (
        <div className="orcamento-content">
          {loading && <p className="empty">Carregando orçamento...</p>}

          {!loading && moveis.length === 0 && <p className="empty">Nenhum móvel ainda.</p>}

          {moveis.map((movel) => (
            <div key={movel.id} className="orcamento-card">
              <button
                className="movel-header"
                onClick={() => setMovelAberto((prev) => (prev === movel.id ? null : movel.id))}
                type="button"
              >
                <div>
                  <strong>{movel.nome}</strong>
                  <span className="movel-sub">{movel.dimensoes}</span>
                  <span className="movel-sub">
                    {movel.material} | {movel.cor}
                  </span>
                </div>
                <div className="movel-right">
                  <span className="price">R$ {movel.total.toFixed(2)}</span>
                  <ChevronDown size={18} className={movelAberto === movel.id ? "rotate" : ""} />
                </div>
              </button>

              {movelAberto === movel.id && (
                <>
                  <ul className="componentes">
                    {movel.componentes.map((componente, index) => (
                      <li key={`${movel.id}-${componente.nome}-${index}`}>
                        <div className="comp-row">
                          <span>
                            {componente.nome} ({componente.quantidade}x) - R${" "}
                            {componente.subtotal.toFixed(2)}
                          </span>
                          <Button
                            className="edit-comp"
                            type="button"
                            onClick={async (event) => {
                              event.stopPropagation();
                              const opcoes = await obterOpcoes(movel.id, index);
                              setOpcoesAbertas({
                                movelId: movel.id,
                                componenteId: index,
                                opcoes,
                              });
                            }}
                          >
                            Editar
                          </Button>
                        </div>

                        {opcoesAbertas &&
                          opcoesAbertas.movelId === movel.id &&
                          opcoesAbertas.componenteId === index && (
                            <div className="opcoes-dropdown">
                              {opcoesAbertas.opcoes.map((opcao) => (
                                <button
                                  key={opcao.id}
                                  type="button"
                                  onClick={async () => {
                                    await atualizarOpcao(movel.id, index, opcao.id);
                                    setOpcoesAbertas(null);
                                  }}
                                >
                                  {opcao.nome} - R$ {opcao.preco_unitario.toFixed(2)}
                                </button>
                              ))}
                            </div>
                          )}
                      </li>
                    ))}
                  </ul>

                  <div className="actions">
                    <Button
                      className="delete"
                      variant="danger"
                      type="button"
                      onClick={() => removerMovelOrcado(movel.id)}
                    >
                      <Trash2 size={14} />
                      Excluir
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="orcamento-total">
            <strong>Total:</strong> R$ {total.toFixed(2)}
          </div>

          {finalizado && pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer">
              <Button className="download-btn" type="button">
                <Download size={16} />
                Baixar PDF
              </Button>
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
