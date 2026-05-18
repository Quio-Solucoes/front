import { NextResponse } from "next/server";
import { resolveBackendBaseUrl } from "@/shared/config/backend";

const BACKEND_BASE_URL = resolveBackendBaseUrl();

async function proxy(request: Request, method: "GET" | "POST") {
  const requestUrl = new URL(request.url);
  const targetUrl = `${BACKEND_BASE_URL}/orcamentos${requestUrl.search}`;

  const authorization = request.headers.get("authorization") ?? "";
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (authorization) headers.Authorization = authorization;

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
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request) {
  return proxy(request, "GET");
}

export async function POST(request: Request) {
  return proxy(request, "POST");
}

