import { NextResponse } from "next/server";

function resolveProxyBaseUrl(): string {
  const base = process.env.AMAZON_API_URL;

  if (!base) {
    throw new Error("Missing AMAZON_API_URL for proxy route");
  }

  return new URL(base).origin;
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
