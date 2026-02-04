# 🪑 Saas de Orçamento - Móveis Planejados

Saas para gerenciamento de orçamentos de móveis planejados, com chat inteligente e interface moderna.

## 🚀 Tecnologias

### Frontend
- **React 18** com **TypeScript**
- **Vite** para build rápido
- **React Router** para navegação
- **Axios** para comunicação com API
- **Lucide React** para ícones
- **CSS Modules** para estilização

### Backend
- **Flask** (Python)
- API REST para chat e orçamentos

## 📦 Instalação

### 1. Frontend (React + TypeScript)

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

O frontend estará disponível em: `http://localhost:3000`

### 2. Backend (Flask)

```bash
# Instalar dependências do Flask
pip install flask flask-cors

# Executar o servidor
python app.py
```

O backend estará disponível em: `http://localhost:5001`

## 🎯 Funcionalidades

### ✅ Implementadas

#### 🔐 Autenticação
- Login com email e senha
- Proteção de rotas privadas
- Persistência de sessão

#### 🏠 Dashboard Home
- Visualização de todos os projetos
- Cards com status e informações
- Criação rápida de novos projetos
- Exclusão de projetos

#### 💬 Chat de Orçamentos
- Interface conversacional moderna
- Integração com API Flask
- Opções interativas (botões de escolha)
- Histórico de mensagens por projeto
- Indicador de digitação

#### 📁 Gestão de Projetos
- Criar projetos com nome e cliente
- Status: Rascunho, Em Andamento, Concluído
- Data de criação
- Armazenamento local

#### 🎨 Interface Profissional
- Design moderno e responsivo
- Sidebar com navegação
- Animações suaves
- Tema consistente

## 📂 Estrutura do Projeto

```
moveis-planejados-crm/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Layout principal
│   │   ├── Sidebar.tsx         # Barra lateral
│   │   └── ProtectedRoute.tsx  # Proteção de rotas
│   ├── contexts/
│   │   └── AuthContext.tsx     # Context de autenticação
│   ├── pages/
│   │   ├── Login.tsx           # Página de login
│   │   ├── Home.tsx            # Dashboard principal
│   │   ├── Projects.tsx        # Lista de projetos
│   │   └── Chat.tsx            # Chat de orçamentos
│   ├── services/
│   │   └── api.ts              # Comunicação com backend
│   ├── styles/
│   │   ├── global.css          # Estilos globais
│   │   ├── Login.css
│   │   ├── Sidebar.css
│   │   ├── Home.css
│   │   ├── Chat.css
│   │   ├── Projects.css
│   │   └── Layout.css
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── App.tsx                 # Componente raiz
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

### Cores Principais
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)

### Componentes Reutilizáveis
- Botões (Primary, Secondary, Danger)
- Cards de Projetos
- Modais
- Formulários
- Chat Bubbles

## 🔌 Integração com Backend

O frontend se comunica com o backend Flask através da rota `/chat`:

```typescript
// Exemplo de chamada
const response = await sendMessage(message, sessionId);
```

### Formato de Request
```json
{
  "message": "Guarda-roupa",
  "session_id": "project-123"
}
```

### Formato de Response
```json
{
  "response": "Mensagem do bot",
  "options": [
    {
      "id": "1",
      "label": "📏 Dimensão"
    }
  ]
}
```

## 🛠️ Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview da build
npm run preview

# Type checking
tsc --noEmit
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (se necessário):

```env
VITE_API_URL=http://localhost:5001
```

## 🔒 Autenticação

Por padrão, o sistema aceita qualquer email/senha para desenvolvimento.

Para implementar autenticação real:

1. Modifique `src/contexts/AuthContext.tsx`
2. Adicione endpoint de login no backend Flask
3. Implemente validação de token JWT

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px+)
- 📱 Tablet (768px+)
- 📱 Mobile (375px+)

## 🎯 Próximos Passos

- [ ] Implementar autenticação real com JWT
- [ ] Adicionar filtros e busca de projetos
- [ ] Exportar orçamentos em PDF
- [ ] Dashboard com gráficos e métricas
- [ ] Notificações em tempo real
- [ ] Upload de imagens para projetos
- [ ] Compartilhamento de orçamentos
- [ ] Histórico de alterações

## 📄 Licença

Este projeto é proprietário e confidencial.




