import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessage } from '../services/api';
import '../styles/Chat.css';

const Chat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project') || 'default';
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar mensagens salvas do projeto
    const savedMessages = localStorage.getItem(`chat_${projectId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Mensagem inicial
      setMessages([{
        id: '1',
        content: '👋 Olá! Qual móvel você gostaria de orçar?\n\nExemplos: Guarda-roupa, Cozinha, Rack...',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
    }
  }, [projectId]);

  useEffect(() => {
    // Salvar mensagens
    if (messages.length > 0) {
      localStorage.setItem(`chat_${projectId}`, JSON.stringify(messages));
    }
  }, [messages, projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(messageText, projectId);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        options: response.options
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '❌ Erro ao processar mensagem. Tente novamente.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-info">
          <Bot size={24} />
          <div>
            <h2>Assistente de Orçamentos</h2>
            <span className="chat-status">Online</span>
          </div>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            
            <div className="message-content">
              <div className="message-bubble">
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              
              {message.options && message.options.length > 0 && (
                <div className="message-options">
                  {message.options.map((option) => (
                    <button
                      key={option.id}
                      className="option-button"
                      onClick={() => handleSendMessage(option.id)}
                      disabled={isLoading}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          className="send-button"
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
