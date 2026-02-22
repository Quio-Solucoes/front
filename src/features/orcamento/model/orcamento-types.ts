export type ComponenteOrcamento = {
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
  subtotal: number;
};

export type MovelOrcado = {
  id: number;
  nome: string;
  dimensoes: string;
  material: string;
  cor: string;
  total: number;
  componentes: ComponenteOrcamento[];
};

export type OpcaoComponente = {
  id: string;
  nome: string;
  preco_unitario: number;
};

export type OpcoesComponenteResponse = {
  opcoes: OpcaoComponente[];
  backend_base_url?: string;
};

export type OrcamentoSnapshot = {
  moveis: MovelOrcado[];
  total: number;
  finalizado: boolean;
  backend_base_url?: string;
};
