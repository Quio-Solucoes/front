"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Download, Mic, Send, User } from "lucide-react";
import { ChatMessage } from "@/entities/chat";
import { SidebarOrcamento } from "@/features/orcamento";
import { Button, Card, Input } from "@/shared/ui";
import { sendMessage } from "../api/send-message";
import { useVoice } from "../lib/use-voice";
import { useChatStore } from "../model/chat-store";

type ChatPanelProps = {
  projectId: string;
};

type ContentBlock =
  | { type: "text"; value: string }
  | { type: "list"; items: string[] };

function parseMessageContent(content: string): ContentBlock[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const blocks: ContentBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push({ type: "list", items: listBuffer });
    listBuffer = [];
  };

  for (const line of lines) {
    if (/^[-*\u2022]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-*\u2022]\s+/, ""));
      continue;
    }

    flushList();
    blocks.push({ type: "text", value: line });
  }

  flushList();
  return blocks;
}

function resolveDownloadUrl(downloadUrl: string, backendBaseUrl?: string): string {
  if (downloadUrl.startsWith("/")) return downloadUrl;
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  if (backendBaseUrl) return `${backendBaseUrl.replace(/\/$/, "")}/${downloadUrl.replace(/^\//, "")}`;
  return downloadUrl;
}

function MessageContent({ content }: Readonly<{ content: string }>) {
  const blocks = parseMessageContent(content);

  return (
    <div className="message-content">
      {blocks.map((block, index) =>
        block.type === "text" ? (
          <p key={`${block.type}-${index}`}>{block.value}</p>
        ) : (
          <ul key={`${block.type}-${index}`} className="message-list">
            {block.items.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

export function ChatPanel({ projectId }: Readonly<ChatPanelProps>) {
  const ensureProject = useChatStore((state) => state.ensureProject);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const messagesByProject = useChatStore((state) => state.messagesByProject);
  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => messagesByProject[projectId] ?? [], [messagesByProject, projectId]);

  useEffect(() => {
    ensureProject(projectId);
  }, [ensureProject, projectId]);

  const mutation = useMutation({
    mutationFn: async (message: string) => sendMessage(message, projectId),
    onSuccess(data) {
      appendMessage(projectId, {
        id: crypto.randomUUID(),
        content: data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
        options: data.options,
        pdfReady: data.pdf_ready,
        downloadUrl: data.download_url,
        backendBaseUrl: data.backend_base_url,
      });
      window.dispatchEvent(
        new CustomEvent("orcamento:refresh", {
          detail: { sessionId: projectId },
        }),
      );
    },
    onError() {
      appendMessage(projectId, {
        id: crypto.randomUUID(),
        content: "Erro ao processar mensagem.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      });
    },
  });

  const submit = (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text || mutation.isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    appendMessage(projectId, userMessage);
    setInput("");
    mutation.mutate(text);
  };

  const { isListening, startListening } = useVoice((text) => submit(text));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  return (
    <div className={`chat-with-orcamento${isOrcamentoOpen ? "" : " collapsed"}`}>
      <div className="stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Assistente de orçamentos</h1>
            <p className="page-subtitle">Projeto: {projectId}</p>
          </div>
        </header>

        <Card className="chat-card">
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-row ${message.sender}`}>
                <div className="message-icon">
                  {message.sender === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-bubble">
                  <MessageContent content={message.content} />
                  {message.pdfReady && message.downloadUrl && (
                    <Button
                      variant="secondary"
                      className="pdf-download-button"
                      onClick={() =>
                        window.open(
                          resolveDownloadUrl(message.downloadUrl!, message.backendBaseUrl),
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      <Download size={16} />
                      Baixar PDF
                    </Button>
                  )}
                  {message.options && message.options.length > 0 && (
                    <div className="options">
                      {message.options.map((option) => (
                        <Button
                          key={option.id}
                          variant="secondary"
                          className="chat-option-tag"
                          onClick={() => submit(option.id)}
                          disabled={mutation.isPending}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {mutation.isPending && <p className="loading-line">Assistente digitando...</p>}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <Input
              placeholder="Digite sua mensagem"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={mutation.isPending}
            />
            <button
              className={`voice-button${isListening ? " listening" : ""}`}
              onClick={startListening}
              type="button"
              disabled={mutation.isPending}
              aria-label="Iniciar reconhecimento de voz"
            >
              <Mic size={16} />
            </button>
            <Button type="submit" disabled={mutation.isPending}>
              <Send size={16} />
              Enviar
            </Button>
          </form>
        </Card>
      </div>

      <SidebarOrcamento
        sessionId={projectId}
        open={isOrcamentoOpen}
        onToggle={() => setIsOrcamentoOpen((prev) => !prev)}
      />
    </div>
  );
}
