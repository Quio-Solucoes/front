import { httpClient } from "@/shared/api/http-client";
import type { Project, ProjectStatus } from "@/entities/project";

export type OrcamentoDto = {
  id: string;
  nome: string;
  cliente: string;
  arquiteto: string;
  ambiente?: string | null;
  status: ProjectStatus;
  criado_em: string;
  atualizado_em: string;
};

export type CreateOrcamentoPayload = {
  cliente: string;
  arquiteto: string;
  ambiente?: string | null;
};

export type UpdateOrcamentoPayload = {
  cliente?: string | null;
  arquiteto?: string | null;
  ambiente?: string | null;
  status?: ProjectStatus | null;
};

export function mapOrcamentoToProject(dto: OrcamentoDto): Project {
  return {
    id: dto.id,
    name: dto.nome,
    client: dto.cliente,
    architect: dto.arquiteto,
    environment: dto.ambiente ?? undefined,
    status: dto.status,
    createdAt: dto.criado_em,
    updatedAt: dto.atualizado_em,
  };
}

export async function listOrcamentos(): Promise<OrcamentoDto[]> {
  const response = await httpClient.get<OrcamentoDto[]>("/orcamentos");
  return response.data;
}

export async function getOrcamento(orcamentoId: string): Promise<OrcamentoDto> {
  const response = await httpClient.get<OrcamentoDto>(`/orcamentos/${orcamentoId}`);
  return response.data;
}

export async function createOrcamento(payload: CreateOrcamentoPayload): Promise<OrcamentoDto> {
  const response = await httpClient.post<OrcamentoDto>("/orcamentos", payload);
  return response.data;
}

export async function updateOrcamento(orcamentoId: string, payload: UpdateOrcamentoPayload): Promise<OrcamentoDto> {
  const response = await httpClient.patch<OrcamentoDto>(`/orcamentos/${orcamentoId}`, payload);
  return response.data;
}

export async function deleteOrcamento(orcamentoId: string): Promise<void> {
  await httpClient.delete(`/orcamentos/${orcamentoId}`);
}

