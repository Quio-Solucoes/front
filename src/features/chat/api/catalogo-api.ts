import { httpClient } from "@/shared/api/http-client";

export type ProdutoCatalogo = {
  id: number;
  nome: string;
  descricao: string;
  imagem?: string;
};

export type VariantesProduto = {
  dimensoes: string[];
  cores: string[];
};

export async function buscarProdutos(termo: string): Promise<ProdutoCatalogo[]> {
  const response = await httpClient.get<ProdutoCatalogo[]>("/catalogo", {
    params: { q: termo },
  });
  return response.data;
}

export async function buscarVariantes(produtoId: number): Promise<VariantesProduto> {
  const response = await httpClient.get<VariantesProduto>(`/catalogo/variantes/${produtoId}`);
  return response.data;
}

export async function adicionarItem(
  sessionId: string,
  payload: {
    produto_id: number;
    dimensao: string;
    cor: string;
    quantidade: number;
    vista_id: string;
  },
): Promise<void> {
  await httpClient.post(`/catalogo/adicionar/${sessionId}`, payload);
}

