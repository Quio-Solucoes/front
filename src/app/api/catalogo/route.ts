import { NextResponse } from "next/server";
import { resolveBackendBaseUrl } from "@/shared/config/backend";

const BACKEND_BASE_URL = resolveBackendBaseUrl();

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const targetUrl = `${BACKEND_BASE_URL}/catalogo${requestUrl.search}`;

  const response = await fetch(targetUrl, { method: "GET", cache: "no-store" });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

