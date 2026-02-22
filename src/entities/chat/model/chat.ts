export type ChatOption = {
  id: string;
  label: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  options?: ChatOption[];
  pdfReady?: boolean;
  downloadUrl?: string;
  backendBaseUrl?: string;
};

export type ChatResponse = {
  response: string;
  options?: ChatOption[];
  pdf_ready?: boolean;
  pdf_filename?: string;
  download_url?: string;
  backend_base_url?: string;
};

