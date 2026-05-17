"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, Package, Palette, Ruler, Search, ShoppingCart } from "lucide-react";
import { Button, Card, Input } from "@/shared/ui";
import { buscarProdutos, buscarVariantes, adicionarItem, type ProdutoCatalogo, type VariantesProduto } from "../api/catalogo-api";
import { editarItem } from "@/features/orcamento/api/orcamento-api";

type Etapa = "produto" | "dimensao" | "cor" | "quantidade" | "confirmar";

const ETAPAS: { id: Etapa; label: string; icon: React.ReactNode }[] = [
  { id: "produto", label: "Produto", icon: <Package size={14} /> },
  { id: "dimensao", label: "Dimensão", icon: <Ruler size={14} /> },
  { id: "cor", label: "Cor", icon: <Palette size={14} /> },
  { id: "quantidade", label: "Quantidade", icon: <span style={{ fontSize: 12, fontWeight: 700 }}>#</span> },
  { id: "confirmar", label: "Confirmar", icon: <ShoppingCart size={14} /> },
];

export type ItemEmEdicao = {
  itemId: number;
  produtoId: number;
  produto: string;
  dimensao: string;
  cor: string;
  quantidade: number;
  vistaId: string;
} | null;

type ProductConfiguratorProps = {
  sessionId: string;
  vistaAtual: string;
  itemEmEdicao: ItemEmEdicao;
  onEdicaoConcluida: () => void;
};

function canAdvance(etapa: Etapa, produto: ProdutoCatalogo | null, dimensao: string, cor: string): boolean {
  if (etapa === "produto") return Boolean(produto);
  if (etapa === "dimensao") return Boolean(dimensao.trim());
  if (etapa === "cor") return Boolean(cor.trim());
  return true;
}

function resolveProdutoImagemSrc(imagem?: string): string {
  if (!imagem) return "/placeholder.svg";
  if (imagem.startsWith("/api/")) return imagem;
  if (/^data:/i.test(imagem)) return imagem;

  if (/^https?:\/\//i.test(imagem)) {
    const parsed = new URL(imagem);
    return `/api/proxy/${parsed.pathname.replace(/^\//, "")}${parsed.search}`;
  }

  if (imagem.startsWith("/")) return `/api/proxy/${imagem.replace(/^\//, "")}`;
  return `/api/proxy/${imagem}`;
}

export function ProductConfigurator({
  sessionId,
  vistaAtual,
  itemEmEdicao,
  onEdicaoConcluida,
}: Readonly<ProductConfiguratorProps>) {
  const [etapa, setEtapa] = useState<Etapa>("produto");
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [produtoSel, setProdutoSel] = useState<ProdutoCatalogo | null>(null);
  const [variantes, setVariantes] = useState<VariantesProduto | null>(null);
  const [carregandoVar, setCarregandoVar] = useState(false);
  const [dimensaoSel, setDimensaoSel] = useState("");
  const [corSel, setCorSel] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    id: number;
    src: string;
    style: CSSProperties;
  } | null>(null);

  const etapaIdx = useMemo(() => ETAPAS.findIndex((e) => e.id === etapa), [etapa]);

  useEffect(() => {
    if (!itemEmEdicao) return;

    setProdutoSel({
      id: itemEmEdicao.produtoId,
      nome: itemEmEdicao.produto,
      descricao: "",
    });
    setDimensaoSel(itemEmEdicao.dimensao || "");
    setCorSel(itemEmEdicao.cor || "");
    setQuantidade(itemEmEdicao.quantidade || 1);
    setEtapa("dimensao");

    void (async () => {
      setCarregandoVar(true);
      try {
        const data = await buscarVariantes(itemEmEdicao.produtoId);
        setVariantes(data);
      } catch {
        setVariantes({ dimensoes: [], cores: [] });
        } finally {
          setCarregandoVar(false);
        }
      })();
  }, [itemEmEdicao]);

  useEffect(() => {
    const termo = busca.trim();
    if (termo.length < 2) {
      setProdutos([]);
      return;
    }

    const t = window.setTimeout(() => {
      void (async () => {
        setBuscando(true);
        try {
          const data = await buscarProdutos(termo);
          setProdutos(data);
        } catch {
          setProdutos([]);
        } finally {
          setBuscando(false);
        }
      })();
    }, 300);

    return () => window.clearTimeout(t);
  }, [busca]);

  const selecionarProduto = async (produto: ProdutoCatalogo) => {
    setProdutoSel(produto);
    setVariantes(null);
    setDimensaoSel("");
    setCorSel("");
    setEtapa("dimensao");

    setCarregandoVar(true);
    try {
      const data = await buscarVariantes(produto.id);
      setVariantes(data);
    } catch {
      setVariantes({ dimensoes: [], cores: [] });
    } finally {
      setCarregandoVar(false);
    }
  };

  const voltar = () => {
    const nextIndex = Math.max(0, etapaIdx - 1);
    setEtapa(ETAPAS[nextIndex].id);
  };

  const avancar = () => {
    if (!canAdvance(etapa, produtoSel, dimensaoSel, corSel)) return;
    const nextIndex = Math.min(ETAPAS.length - 1, etapaIdx + 1);
    setEtapa(ETAPAS[nextIndex].id);
  };

  const confirmar = async () => {
    if (!produtoSel) return;
    setSalvando(true);
    setErro(null);

    try {
      if (itemEmEdicao?.itemId != null) {
        await editarItem(sessionId, itemEmEdicao.itemId, {
          produto_id: produtoSel.id,
          dimensao: dimensaoSel,
          cor: corSel,
          quantidade,
          vista_id: vistaAtual,
        });
        onEdicaoConcluida();
      } else {
        await adicionarItem(sessionId, {
          produto_id: produtoSel.id,
          dimensao: dimensaoSel,
          cor: corSel,
          quantidade,
          vista_id: vistaAtual,
        });
      }

      window.dispatchEvent(
        new CustomEvent("orcamento:refresh", {
          detail: { sessionId },
        }),
      );

      if (!itemEmEdicao) {
        setBusca("");
        setProdutos([]);
        setProdutoSel(null);
        setVariantes(null);
        setDimensaoSel("");
        setCorSel("");
        setQuantidade(1);
        setEtapa("produto");
      }
    } catch {
      setErro("Não foi possível salvar o item.");
    } finally {
      setSalvando(false);
    }
  };

  const openPreview = (produto: ProdutoCatalogo, anchor: HTMLElement) => {
    const src = resolveProdutoImagemSrc(produto.imagem);
    const anchorRect = anchor.getBoundingClientRect();

    const previewSize = 220;
    const gap = 12;
    const margin = 12;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const preferRight = anchorRect.right + gap + previewSize <= viewportW - margin;
    const left = preferRight
      ? Math.min(anchorRect.right + gap, viewportW - margin - previewSize)
      : Math.max(margin, anchorRect.left - gap - previewSize);

    const top = Math.min(
      Math.max(margin, anchorRect.top + anchorRect.height / 2 - previewSize / 2),
      viewportH - margin - previewSize,
    );

    setPreview({
      id: produto.id,
      src,
      style: {
        position: "fixed",
        left,
        top,
        width: previewSize,
        height: previewSize,
      },
    });
  };

  const closePreview = () => setPreview(null);

  return (
    <Card className="configurator-card">
      <header className="configurator-header">
        <div className="configurator-header-left">
          <h2 className="page-title">Adicionar item</h2>
          <p className="page-subtitle">Selecione produto, variações e confirme.</p>
        </div>
        <div className="configurator-steps" aria-label="Etapas do configurador">
          {ETAPAS.map((step) => (
            <div
              key={step.id}
              className={[
                "configurator-step",
                step.id === etapa ? "active" : "",
                ETAPAS.findIndex((s) => s.id === step.id) < etapaIdx ? "done" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="configurator-step-icon">{step.icon}</span>
              <span className="configurator-step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="configurator-body">
        {etapa === "produto" && (
          <div className="configurator-pane">
            <label className="configurator-label" htmlFor="busca-produto">
              Buscar produto
            </label>
            <div className="configurator-search">
              <Search size={16} />
              <Input
                id="busca-produto"
                placeholder="Digite pelo menos 2 letras"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            {buscando && <p className="configurator-muted">Buscando...</p>}
            {!buscando && busca.trim().length >= 2 && produtos.length === 0 && (
              <p className="configurator-muted">Nenhum resultado.</p>
            )}
            <div className="configurator-grid">
              {produtos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="configurator-product"
                  onClick={() => selecionarProduto(p)}
                >
                  <div className="configurator-product-media" aria-hidden="true">
                    <div className="configurator-product-thumb">
                      <Image
                        src={resolveProdutoImagemSrc(p.imagem)}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized
                        onMouseEnter={(event) => openPreview(p, event.currentTarget)}
                        onMouseLeave={closePreview}
                        onFocus={(event) => openPreview(p, event.currentTarget)}
                        onBlur={closePreview}
                        onError={(event) => {
                          const img = event.currentTarget as HTMLImageElement;
                          img.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                  <div className="configurator-product-info">
                    <div className="configurator-product-name">{p.nome}</div>
                    <div className="configurator-product-desc">{p.descricao}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === "dimensao" && (
          <div className="configurator-pane">
            <h3 className="configurator-title">Dimensão</h3>
            <p className="configurator-muted">
              Produto: <strong>{produtoSel?.nome}</strong>
            </p>
            {carregandoVar ? (
              <p className="configurator-muted">Carregando opções...</p>
            ) : (
              <>
                {variantes && variantes.dimensoes.length > 0 && (
                  <div className="configurator-options">
                    {variantes.dimensoes.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`configurator-option${dimensaoSel === d ? " selected" : ""}`}
                        onClick={() => setDimensaoSel(d)}
                      >
                        {dimensaoSel === d && <Check size={12} />}
                        {d}
                      </button>
                    ))}
                  </div>
                )}

                <div className="configurator-manual">
                  {variantes && variantes.dimensoes.length > 0 && <p className="configurator-muted">Ou digite uma dimensão:</p>}
                  <Input placeholder="Ex: 800x700x600" value={dimensaoSel} onChange={(e) => setDimensaoSel(e.target.value)} />
                </div>
              </>
            )}
          </div>
        )}

        {etapa === "cor" && (
          <div className="configurator-pane">
            <h3 className="configurator-title">Cor</h3>
            <p className="configurator-muted">
              Dimensão: <strong>{dimensaoSel || "—"}</strong>
            </p>
            {carregandoVar ? (
              <p className="configurator-muted">Carregando opções...</p>
            ) : variantes && variantes.cores.length > 0 ? (
              <div className="configurator-options">
                {variantes.cores.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`configurator-option${corSel === c ? " selected" : ""}`}
                    onClick={() => setCorSel(c)}
                  >
                    {corSel === c && <Check size={12} />}
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <Input placeholder="Cor" value={corSel} onChange={(e) => setCorSel(e.target.value)} />
            )}
          </div>
        )}

        {etapa === "quantidade" && (
          <div className="configurator-pane">
            <h3 className="configurator-title">Quantidade</h3>
            <div className="configurator-qty">
              <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} className="qty-btn">
                –
              </button>
              <Input
                className="qty-input"
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Number.parseInt(e.target.value || "1", 10) || 1))}
              />
              <button type="button" onClick={() => setQuantidade((q) => q + 1)} className="qty-btn">
                +
              </button>
            </div>
          </div>
        )}

        {etapa === "confirmar" && (
          <div className="configurator-pane">
            <h3 className="configurator-title">Confirmar</h3>
            <div className="configurator-summary">
              <div className="summary-media" aria-hidden="true">
                <Image
                  src={resolveProdutoImagemSrc(produtoSel?.imagem)}
                  alt=""
                  width={84}
                  height={84}
                  unoptimized
                  onError={(event) => {
                    const img = event.currentTarget as HTMLImageElement;
                    img.src = "/placeholder.svg";
                  }}
                />
              </div>

              <div className="summary-info">
                <div className="summary-row">
                  <span>Produto</span>
                  <strong>{produtoSel?.nome}</strong>
                </div>
                <div className="summary-row">
                  <span>Dimensão</span>
                  <strong>{dimensaoSel || "—"}</strong>
                </div>
                <div className="summary-row">
                  <span>Cor</span>
                  <strong>{corSel || "—"}</strong>
                </div>
                <div className="summary-row">
                  <span>Quantidade</span>
                  <strong>{quantidade}</strong>
                </div>
                <div className="summary-row">
                  <span>Vista</span>
                  <strong>{vistaAtual}</strong>
                </div>
              </div>
            </div>
            {erro && <p className="configurator-error">{erro}</p>}
          </div>
        )}
      </div>

      <footer className="configurator-footer">
        {etapaIdx > 0 ? (
          <Button type="button" variant="secondary" onClick={voltar} disabled={salvando}>
            <ChevronLeft size={16} />
            Voltar
          </Button>
        ) : (
          <span />
        )}

        <div style={{ flex: 1 }} />

        {etapa !== "confirmar" ? (
          <Button type="button" onClick={avancar} disabled={!canAdvance(etapa, produtoSel, dimensaoSel, corSel) || salvando}>
            Próximo
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button type="button" onClick={confirmar} disabled={salvando}>
            {salvando ? "Salvando..." : itemEmEdicao ? "Salvar alterações" : "Adicionar ao orçamento"}
          </Button>
        )}
      </footer>

      {preview && (
        <div
          className="configurator-product-preview"
          style={preview.style}
          role="presentation"
          aria-hidden="true"
        >
          <Image
            src={preview.src}
            alt=""
            width={220}
            height={220}
            unoptimized
            onError={(event) => {
              const img = event.currentTarget as HTMLImageElement;
              img.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
    </Card>
  );
}
