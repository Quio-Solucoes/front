import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function getAccessTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("quio-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string | null } };
    const token = parsed?.state?.accessToken;
    return token && typeof token === "string" ? token : null;
  } catch {
    return null;
  }
}

httpClient.interceptors.request.use((config) => {
  const token = getAccessTokenFromStorage();
  if (!token) return config;

  config.headers = config.headers ?? {};
  if (!("Authorization" in config.headers)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

