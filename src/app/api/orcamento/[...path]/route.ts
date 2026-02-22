import { NextResponse } from "next/server";

const BACKEND_CHAT_URL = process.env.BACKEND_CHAT_URL ?? "http://localhost:5001/chat";
const BACKEND_BASE_URL = new URL(BACKEND_CHAT_URL).origin;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(
  request: Request,
  context: RouteContext,
  method: "GET" | "POST" | "DELETE",
) {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const targetUrl = `${BACKEND_BASE_URL}/orcamento/${path.join("/")}${requestUrl.search}`;

  const headers: HeadersInit = { "Content-Type": "application/json" };
  const init: RequestInit = { method, headers, cache: "no-store" };

  if (method !== "GET") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return new Response(await response.arrayBuffer(), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  const data = await response.json();
  if (data && typeof data === "object") {
    return NextResponse.json(
      {
        ...data,
        backend_base_url: (data as Record<string, unknown>).backend_base_url ?? BACKEND_BASE_URL,
      },
      { status: response.status },
    );
  }

  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request, context: RouteContext) {
  return proxy(request, context, "GET");
}

export async function POST(request: Request, context: RouteContext) {
  return proxy(request, context, "POST");
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxy(request, context, "DELETE");
}
