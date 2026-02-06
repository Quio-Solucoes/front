import axios from 'axios';
import { ChatResponse } from '../types';

const api = axios.create({
  baseURL: '/chat',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendMessage = async (
  message: string,
  sessionId: string
): Promise<ChatResponse> => {
  try {
    const response = await api.post('', {
      message,
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export default api;
