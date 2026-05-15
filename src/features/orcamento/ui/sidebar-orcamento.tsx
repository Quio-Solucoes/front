"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { useOrcamento } from "../model/use-orcamento";

type SidebarOrcamentoProps = {
  sessionId: string;
  open: boolean;
  onToggle: () => void;
  onStartEdit: (payload: {
    itemId: number;
    produtoId: number;
    produto: string;
    dimensao: string;
    cor: string;
    quantidade: number;
    vistaId: string;
  }) => void;
};

const VISTAS_LABELS: Record<string, string> = {
  frontal: "Vista A – Frontal",
  lateral_esq: "Vista B – Lateral Esq.",
  lateral_dir: "Vista C – Lateral Dir.",
  fundos: "Vista D – Fundos",
  interna: "Teto / Interna",
};

function resolvePdfUrl(baseUrl: string | null, sessionId: string): string | null {
  if (!baseUrl) return null;
  return `/api/proxy/download-pdf/${encodeURIComponent(sessionId)}`;
}

export function SidebarOrcamento({ sessionId, open, onToggle, onStartEdit }: Readonly<SidebarOrcamentoProps>) {
  const { vistas, total, finalizado, backendBaseUrl, loading, removerItemOrcado } = useOrcamento(sessionId);
  const [vistaAberta, setVistaAberta] = useState<string | null>(null);

  const pdfUrl = resolvePdfUrl(backendBaseUrl, sessionId);
  const vistaIds = Object.keys(vistas ?? {});

  return (
    <aside className={`orcamento-sidebar ${open ? "open" : "closed"}`}>
      <div className="orcamento-header">
        {open && <h3>Orçamento</h3>}
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
          {!loading && vistaIds.length === 0 && <p className="empty">Nenhum item ainda.</p>}

          {vistaIds.map((vistaId) => {
            const itens = vistas[vistaId] ?? [];
            const subtotal = itens.reduce((acc, item) => acc + (item.subtotal ?? 0), 0);
            const label = VISTAS_LABELS[vistaId] ?? vistaId;

            return (
              <div key={vistaId} className="orcamento-card">
                <button
                  className="movel-header"
                  onClick={() => setVistaAberta((prev) => (prev === vistaId ? null : vistaId))}
                  type="button"
                >
                  <div>
                    <strong>{label}</strong>
                    <span className="movel-sub">
                      {itens.length} item{itens.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="movel-right">
                    <span className="price">R$ {subtotal.toFixed(2)}</span>
                    <ChevronDown size={18} className={vistaAberta === vistaId ? "rotate" : ""} />
                  </div>
                </button>

                {vistaAberta === vistaId && (
                  <ul className="componentes">
                    {itens.map((item) => (
                      <li key={`${vistaId}-${item.item_id}`}>
                        <div className="comp-row">
                          <span>
                            {item.produto} ({item.quantidade}x) - R$ {item.subtotal.toFixed(2)}
                          </span>
                          <div className="item-actions">
                            <Button
                              className="edit-comp"
                              type="button"
                              onClick={() => {
                                if (!item.produto_id) return;
                                onStartEdit({
                                  itemId: item.item_id,
                                  produtoId: item.produto_id,
                                  produto: item.produto,
                                  dimensao: item.dimensao,
                                  cor: item.cor,
                                  quantidade: item.quantidade,
                                  vistaId,
                                });
                              }}
                              disabled={!item.produto_id}
                            >
                              <Pencil size={14} />
                              Editar
                            </Button>
                            <Button
                              className="item-delete"
                              variant="danger"
                              type="button"
                              onClick={() => removerItemOrcado(item.item_id)}
                            >
                              <Trash2 size={14} />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          <div className="orcamento-total">
            <strong>Total:</strong> R$ {total.toFixed(2)}
          </div>

          {vistaIds.length > 0 && pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer">
              <Button className="download-btn" type="button">
                <Download size={16} />
                {finalizado ? "Baixar PDF" : "Gerar PDF"}
              </Button>
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
