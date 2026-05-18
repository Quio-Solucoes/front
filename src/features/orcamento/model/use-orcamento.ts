"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrcamento, removerItem } from "../api/orcamento-api";
import { ItemOrcado } from "./orcamento-types";

type UseOrcamentoState = {
  vistas: Record<string, ItemOrcado[]>;
  total: number;
  finalizado: boolean;
  backendBaseUrl: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  removerItemOrcado: (itemId: number) => Promise<void>;
};

export function useOrcamento(sessionId: string): UseOrcamentoState {
  const [vistas, setVistas] = useState<Record<string, ItemOrcado[]>>({});
  const [total, setTotal] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [backendBaseUrl, setBackendBaseUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrcamento(sessionId);
      setVistas(data.vistas ?? {});
      setTotal(data.total ?? 0);
      setFinalizado(Boolean(data.finalizado));
      setBackendBaseUrl(data.backend_base_url ?? null);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const removerItemOrcado = useCallback(
    async (itemId: number) => {
      await removerItem(sessionId, itemId);
      await refresh();
    },
    [refresh, sessionId],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ sessionId?: string }>;
      if (!customEvent.detail?.sessionId || customEvent.detail.sessionId === sessionId) {
        void refresh();
      }
    };

    window.addEventListener("orcamento:refresh", handler);
    return () => window.removeEventListener("orcamento:refresh", handler);
  }, [refresh, sessionId]);

  return {
    vistas,
    total,
    finalizado,
    backendBaseUrl,
    loading,
    refresh,
    removerItemOrcado,
  };
}
