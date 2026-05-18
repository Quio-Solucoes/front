"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/entities/project";
import {
  createOrcamento,
  deleteOrcamento,
  listOrcamentos,
  mapOrcamentoToProject,
  type CreateOrcamentoPayload,
} from "../api/orcamentos-api";

type UseOrcamentosState = {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProject: (payload: CreateOrcamentoPayload) => Promise<Project | null>;
  deleteProject: (orcamentoId: string) => Promise<void>;
  suggestions: { architects: string[]; clients: string[]; environments: string[] };
};

export function useOrcamentos(): UseOrcamentosState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listOrcamentos();
      setProjects(data.map(mapOrcamentoToProject));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar orçamentos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (payload: CreateOrcamentoPayload) => {
    const cliente = payload.cliente?.trim();
    const arquiteto = payload.arquiteto?.trim();
    if (!cliente || !arquiteto) return null;

    setError(null);
    try {
      const created = await createOrcamento({ ...payload, cliente, arquiteto });
      const project = mapOrcamentoToProject(created);
      setProjects((prev) => [project, ...prev]);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar orçamento");
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (orcamentoId: string) => {
    setError(null);
    try {
      await deleteOrcamento(orcamentoId);
      setProjects((prev) => prev.filter((p) => p.id !== orcamentoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao remover orçamento");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      void refresh();
    };
    window.addEventListener("orcamentos:refresh", handler);
    return () => window.removeEventListener("orcamentos:refresh", handler);
  }, [refresh]);

  const suggestions = useMemo(() => {
    const architects = Array.from(
      new Set(projects.map((p) => p.architect).filter((v): v is string => Boolean(v && v.trim()))),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
    const clients = Array.from(new Set(projects.map((p) => p.client).filter((v): v is string => Boolean(v && v.trim())))).sort(
      (a, b) => a.localeCompare(b, "pt-BR"),
    );
    const environments = Array.from(
      new Set(projects.map((p) => p.environment).filter((v): v is string => Boolean(v && v.trim()))),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
    return { architects, clients, environments };
  }, [projects]);

  return { projects, loading, error, refresh, createProject, deleteProject, suggestions };
}
