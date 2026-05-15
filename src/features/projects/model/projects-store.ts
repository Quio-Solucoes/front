"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Project } from "@/entities/project";

type CreateProjectInput = {
  architect: string;
  client: string;
};

type ProjectsState = {
  projects: Project[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  createProject: (input: CreateProjectInput) => Project | null;
  deleteProject: (projectId: string) => void;
  updateProjectStatus: (projectId: string, status: Project["status"]) => void;
  setProjectEnvironment: (projectId: string, environment: string) => void;
};

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      hasHydrated: false,
      setHasHydrated(value) {
        set({ hasHydrated: value });
      },
      createProject(input) {
        const architect = input.architect.trim();
        const client = input.client.trim();
        if (!architect || !client) return null;

        const now = new Date().toISOString();
        const project: Project = {
          id: crypto.randomUUID(),
          name: `${client} • ${architect}`,
          architect,
          client,
          createdAt: now,
          updatedAt: now,
          status: "draft",
        };

        set({ projects: [project, ...get().projects] });
        return project;
      },
      deleteProject(projectId) {
        set({ projects: get().projects.filter((project) => project.id !== projectId) });
      },
      updateProjectStatus(projectId, status) {
        const now = new Date().toISOString();
        set({
          projects: get().projects.map((project) =>
            project.id === projectId ? { ...project, status, updatedAt: now } : project,
          ),
        });
      },
      setProjectEnvironment(projectId, environment) {
        const value = environment.trim();
        if (!value) return;
        const now = new Date().toISOString();
        set({
          projects: get().projects.map((project) =>
            project.id === projectId ? { ...project, environment: value, updatedAt: now } : project,
          ),
        });
      },
    }),
    {
      name: "quio-projects",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
