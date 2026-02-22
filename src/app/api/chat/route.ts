import { NextResponse } from "next/server";

type ChatRequest = {
  message?: string;
  session_id?: string;
};

type ChatOption = {
  id: string;
  label: string;
};

type ChatResponse = {
  response: string;
  options?: ChatOption[];
  pdf_ready?: boolean;
  pdf_filename?: string;
  download_url?: string;
  backend_base_url?: string;
};

const BACKEND_CHAT_URL = process.env.BACKEND_CHAT_URL ?? "http://localhost:5001/chat";
const BACKEND_BASE_URL = new URL(BACKEND_CHAT_URL).origin;

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const message = body.message?.trim();
  const sessionId = body.session_id?.trim() || "default";

  if (!message) {
    return NextResponse.json({ error: "Mensagem obrigatoria" }, { status: 400 });
  }

  try {
    const response = await fetch(BACKEND_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = (await response.json()) as ChatResponse;
    return NextResponse.json({
      ...data,
      backend_base_url: data.backend_base_url ?? BACKEND_BASE_URL,
    });
  } catch {
    // Fallback para manter o fluxo funcional se o backend estiver offline.
    const fallback: ChatResponse = {
      response: `Recebi: "${message}". Backend indisponivel no momento.`,
      options: [
        { id: "novo_orcamento", label: "Novo orcamento" },
        { id: "ajustar_dimensoes", label: "Ajustar dimensoes" },
      ],
      pdf_ready: false,
      backend_base_url: BACKEND_BASE_URL,
    };

    return NextResponse.json(fallback, { status: 200 });
  }
}

