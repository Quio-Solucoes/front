import "server-only";

type BackendProvider = "local" | "aws";

const DEFAULT_LOCAL_CHAT_URL = "http://localhost:5001/chat";

function normalizeProvider(value?: string): BackendProvider {
  return value?.toLowerCase() === "aws" ? "aws" : "local";
}

function normalizeChatUrlFromBase(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  return /\/chat$/i.test(trimmed) ? trimmed : `${trimmed}/chat`;
}

export function resolveBackendChatUrl(): string {
  const isVercelProduction = process.env.VERCEL_ENV === "production";
  const amazonApiUrl = process.env.AMAZON_API_URL;

  if (isVercelProduction) {
    if (!amazonApiUrl) {
      throw new Error("Missing AMAZON_API_URL in Vercel production");
    }

    return normalizeChatUrlFromBase(amazonApiUrl);
  }

  if (amazonApiUrl) return normalizeChatUrlFromBase(amazonApiUrl);

  const explicitUrl = process.env.BACKEND_CHAT_URL;
  if (explicitUrl) return explicitUrl;

  const provider = normalizeProvider(process.env.BACKEND_PROVIDER);
  const localUrl = process.env.BACKEND_CHAT_URL_LOCAL ?? DEFAULT_LOCAL_CHAT_URL;

  if (provider === "aws") {
    return localUrl;
  }

  return localUrl;
}

export function resolveBackendBaseUrl(): string {
  return new URL(resolveBackendChatUrl()).origin;
}
