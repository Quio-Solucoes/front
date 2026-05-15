import { NextResponse } from "next/server";
import { resolveBackendBaseUrl } from "@/shared/config/backend";

function resolveProxyBaseUrl(): string {
  const base = process.env.AMAZON_API_URL;

  if (base) return new URL(base).origin;

  // Dev/local fallback: proxy to the backend inferred from BACKEND_* env vars.
  return resolveBackendBaseUrl();
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const requestUrl = new URL(req.url);
  const target = `${resolveProxyBaseUrl()}/${path.join("/")}${requestUrl.search}`;

  const response = await fetch(target, { method: "GET", cache: "no-store" });
  const data = await response.arrayBuffer();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/octet-stream",
    },
  });
}
