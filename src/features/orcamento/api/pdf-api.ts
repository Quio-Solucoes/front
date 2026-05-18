import { httpClient } from "@/shared/api/http-client";

export async function downloadOrcamentoPdf(orcamentoId: string): Promise<Blob> {
  const encoded = encodeURIComponent(orcamentoId);
  const response = await httpClient.get(`/proxy/download-pdf/${encoded}`, { responseType: "blob" });
  return response.data as Blob;
}

