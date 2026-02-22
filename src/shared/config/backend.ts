import "server-only";

type BackendProvider = "local" | "aws";

const DEFAULT_LOCAL_CHAT_URL = "http://localhost:5001/chat";

function normalizeProvider(value?: string): BackendProvider {
  return value?.toLowerCase() === "aws" ? "aws" : "local";
}

export function resolveBackendChatUrl(): string {
  const explicitUrl = process.env.BACKEND_CHAT_URL;
  if (explicitUrl) return explicitUrl;

  const provider = normalizeProvider(process.env.BACKEND_PROVIDER);
  const localUrl = process.env.BACKEND_CHAT_URL_LOCAL ?? DEFAULT_LOCAL_CHAT_URL;
  const awsUrl = process.env.NEXT_PUBLIC_AMAZON_API_URL;

  if (provider === "aws") {
    return awsUrl ?? localUrl;
  }

  return localUrl;
}

export function resolveBackendBaseUrl(): string {
  return new URL(resolveBackendChatUrl()).origin;
}
