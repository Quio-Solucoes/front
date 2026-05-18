import { httpClient } from "@/shared/api/http-client";
import { OrcamentoSnapshot } from "../model/orcamento-types";

export async function getOrcamento(sessionId: string): Promise<OrcamentoSnapshot> {
  const response = await httpClient.get<OrcamentoSnapshot>(`/orcamento/${sessionId}`);
  return response.data;
}

export async function removerItem(sessionId: string, itemId: number): Promise<void> {
  await httpClient.delete(`/orcamento/${sessionId}/remover/${itemId}`);
}

export async function editarItem(
  sessionId: string,
  itemId: number,
  payload: {
    produto_id: number;
    dimensao: string;
    cor: string;
    quantidade: number;
    vista_id: string;
  },
): Promise<void> {
  await httpClient.put(`/orcamento/${sessionId}/editar-item/${itemId}`, payload);
}
