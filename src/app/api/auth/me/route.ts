import { NextResponse } from "next/server";
import { resolveBackendBaseUrl } from "@/shared/config/backend";

const BACKEND_BASE_URL = resolveBackendBaseUrl();

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";

  const response = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
    method: "GET",
    headers: authorization ? { Authorization: authorization } : undefined,
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

