export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  client?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in-progress' | 'completed';
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  options?: ChatOption[];
}

export interface ChatOption {
  id: string;
  label: string;
}

export interface ChatResponse {
  response: string;
  options?: ChatOption[];
}

export interface Configuration {
  movel: string;
  dimensoes: {
    largura: number;
    altura: number;
    profundidade: number;
  };
  cor: string;
  material: string;
  componentes: Componente[];
  total: number;
}

export interface Componente {
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
}
