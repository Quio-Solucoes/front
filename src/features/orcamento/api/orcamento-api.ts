import { httpClient } from "@/shared/api/http-client";
import {
  OpcoesComponenteResponse,
  OrcamentoSnapshot,
} from "../model/orcamento-types";

export async function getOrcamento(sessionId: string): Promise<OrcamentoSnapshot> {
  const response = await httpClient.get<OrcamentoSnapshot>(`/orcamento/${sessionId}`);
  return response.data;
}

export async function removerMovel(sessionId: string, movelId: number): Promise<void> {
  await httpClient.delete(`/orcamento/${sessionId}/remover/${movelId}`);
}

export async function obterOpcoesComponente(
  sessionId: string,
  movelId: number,
  componenteId: number,
): Promise<OpcoesComponenteResponse> {
  const response = await httpClient.get<OpcoesComponenteResponse>(
    `/orcamento/${sessionId}/editar-componente/${movelId}/${componenteId}`,
  );
  return response.data;
}

export async function atualizarComponente(
  sessionId: string,
  movelId: number,
  componenteId: number,
  opcaoId: string,
): Promise<void> {
  await httpClient.post(`/orcamento/${sessionId}/atualizar-componente/${movelId}/${componenteId}`, {
    opcao_id: opcaoId,
  });
}
