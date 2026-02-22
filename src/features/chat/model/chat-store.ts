"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChatMessage } from "@/entities/chat";

type ChatState = {
  messagesByProject: Record<string, ChatMessage[]>;
  ensureProject: (projectId: string) => void;
  appendMessage: (projectId: string, message: ChatMessage) => void;
};

const defaultMessage = (): ChatMessage => ({
  id: crypto.randomUUID(),
  content: "Olá! Qual móvel você gostaria de orçar hoje?",
  sender: "bot",
  timestamp: new Date().toISOString(),
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messagesByProject: {},
      ensureProject(projectId) {
        if (get().messagesByProject[projectId]) return;
        set({
          messagesByProject: {
            ...get().messagesByProject,
            [projectId]: [defaultMessage()],
          },
        });
      },
      appendMessage(projectId, message) {
        const list = get().messagesByProject[projectId] ?? [defaultMessage()];
        set({
          messagesByProject: {
            ...get().messagesByProject,
            [projectId]: [...list, message],
          },
        });
      },
    }),
    {
      name: "quio-chat",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") return persistedState;

        const state = persistedState as ChatState;
        const nextMessagesByProject = Object.fromEntries(
          Object.entries(state.messagesByProject ?? {}).map(([projectId, messages]) => [
            projectId,
            messages.map((message) =>
              message.content === "Ola! Qual movel voce gostaria de orcar hoje?"
                ? { ...message, content: "Olá! Qual móvel você gostaria de orçar hoje?" }
                : message,
            ),
          ]),
        );

        return { ...state, messagesByProject: nextMessagesByProject };
      },
    },
  ),
);
