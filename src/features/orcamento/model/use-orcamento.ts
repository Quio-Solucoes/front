"use client";

import { useCallback, useEffect, useState } from "react";
import {
  atualizarComponente,
  getOrcamento,
  obterOpcoesComponente,
  removerMovel,
} from "../api/orcamento-api";
import { MovelOrcado, OpcaoComponente } from "./orcamento-types";

type UseOrcamentoState = {
  moveis: MovelOrcado[];
  total: number;
  finalizado: boolean;
  backendBaseUrl: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  removerMovelOrcado: (movelId: number) => Promise<void>;
  obterOpcoes: (movelId: number, componenteId: number) => Promise<OpcaoComponente[]>;
  atualizarOpcao: (movelId: number, componenteId: number, opcaoId: string) => Promise<void>;
};

export function useOrcamento(sessionId: string): UseOrcamentoState {
  const [moveis, setMoveis] = useState<MovelOrcado[]>([]);
  const [total, setTotal] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [backendBaseUrl, setBackendBaseUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrcamento(sessionId);
      setMoveis(data.moveis ?? []);
      setTotal(data.total ?? 0);
      setFinalizado(Boolean(data.finalizado));
      setBackendBaseUrl(data.backend_base_url ?? null);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const removerMovelOrcado = useCallback(
    async (movelId: number) => {
      await removerMovel(sessionId, movelId);
      await refresh();
    },
    [refresh, sessionId],
  );

  const obterOpcoes = useCallback(
    async (movelId: number, componenteId: number) => {
      const data = await obterOpcoesComponente(sessionId, movelId, componenteId);
      if (data.backend_base_url) setBackendBaseUrl(data.backend_base_url);
      return data.opcoes ?? [];
    },
    [sessionId],
  );

  const atualizarOpcao = useCallback(
    async (movelId: number, componenteId: number, opcaoId: string) => {
      await atualizarComponente(sessionId, movelId, componenteId, opcaoId);
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
    moveis,
    total,
    finalizado,
    backendBaseUrl,
    loading,
    refresh,
    removerMovelOrcado,
    obterOpcoes,
    atualizarOpcao,
  };
}
