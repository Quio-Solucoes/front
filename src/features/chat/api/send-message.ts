import { ChatResponse } from "@/entities/chat";
import { httpClient } from "@/shared/api/http-client";

export async function sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
  const response = await httpClient.post<ChatResponse>("/chat", {
    message,
    session_id: sessionId,
  });

  return response.data;
}
