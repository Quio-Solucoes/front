export type ItemOrcado = {
  item_id: number;
  produto_id?: number;
  produto: string;
  dimensao: string;
  cor: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
};

export type OrcamentoSnapshot = {
  vistas: Record<string, ItemOrcado[]>;
  total: number;
  finalizado: boolean;
  backend_base_url?: string;
};
