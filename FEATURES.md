# 📱 Fluxos e Funcionalidades do Sistema

## 🎨 Design e Interface

### Paleta de Cores
- **Primary (Indigo)**: `#6366f1` - Ações principais, links, botões
- **Secondary (Purple)**: `#8b5cf6` - Destaques secundários
- **Success (Green)**: `#10b981` - Status positivos, confirmações
- **Danger (Red)**: `#ef4444` - Ações destrutivas, erros
- **Warning (Yellow)**: `#f59e0b` - Avisos, atenção

### Tipografia
- **Fonte**: System fonts (San Francisco, Segoe UI, Roboto)
- **Títulos**: 700 (Bold)
- **Subtítulos**: 600 (Semibold)
- **Texto normal**: 400 (Regular)

## 🔄 Fluxos de Usuário

### 1️⃣ Login e Autenticação

```
┌─────────────┐
│   Login     │
│             │
│ Email: ___  │
│ Senha: ___  │
│             │
│  [Entrar]   │
└─────────────┘
       ↓
   Validação
       ↓
  ┌─────────┐
  │  Home   │
  └─────────┘
```

**Recursos**:
- Validação de campos obrigatórios
- Feedback visual de erro
- Sessão persistente (localStorage)
- Logout seguro

### 2️⃣ Criação de Projeto

```
Home
  ↓
[+ Novo Projeto]
  ↓
┌──────────────────┐
│ Nome: _________  │
│ Cliente: ______  │
│                  │
│ [Cancelar] [OK]  │
└──────────────────┘
  ↓
Projeto criado com status "Rascunho"
  ↓
Redirecionado para Chat
```

**Campos**:
- Nome do projeto (obrigatório)
- Nome do cliente (opcional)
- Status automático: "Rascunho"
- Data de criação automática

### 3️⃣ Fluxo de Orçamento (Chat)

```
Chat
  ↓
Bot: "Qual móvel deseja orçar?"
  ↓
Usuário: "Guarda-roupa"
  ↓
Bot: Apresenta configuração padrão
     [📏 Dimensão] [🎨 Cor] [🪵 Material] [🔧 Componentes] [✅ Confirmar]
  ↓
Usuário seleciona opção
  ↓
Bot: Solicita entrada específica
  ↓
Usuário fornece dados
  ↓
Bot: Atualiza configuração
     [Volta ao menu principal]
  ↓
Usuário: [✅ Confirmar]
  ↓
Bot: "Total final: R$ X,XX"
```

**Interações Disponíveis**:

#### A) Dimensões
```
Bot: "Digite as dimensões: L x A x P"
Usuário: "800 x 700 x 600"
Bot: "✅ Dimensão atualizada!"
```

#### B) Cor
```
Bot: "Escolha a cor:"
     [Branco] [Preto] [Amadeirado]
Usuário: Clica em um botão
Bot: "✅ Cor atualizada!"
```

#### C) Material
```
Bot: "Escolha o material:"
     [MDP] [MDF] [Alumínio]
Usuário: Clica em um botão
Bot: "✅ Material atualizado!"
```

#### D) Componentes
```
Bot: "Qual componente alterar?"
     [Dobradiça] [Puxador] [Corrediça] [⬅ Voltar]
Usuário: [Dobradiça]
Bot: Mostra opções de dobradiças
     [Premium R$ 25,00] [Standard R$ 15,00] [Básica R$ 8,00]
Usuário: [Premium R$ 25,00]
Bot: "✅ Componente atualizado!"
```

## 📊 Estados dos Projetos

### Rascunho (Draft)
- **Ícone**: ✏️ Edit3
- **Cor**: Cinza
- **Descrição**: Projeto iniciado, mas não finalizado

### Em Andamento (In Progress)
- **Ícone**: 🕐 Clock
- **Cor**: Amarelo
- **Descrição**: Orçamento em elaboração

### Concluído (Completed)
- **Ícone**: ✅ CheckCircle
- **Cor**: Verde
- **Descrição**: Orçamento finalizado

## 🎯 Funcionalidades por Página

### Login (`/login`)
✅ Autenticação de usuário
✅ Validação de formulário
✅ Feedback de erro
✅ Animações de entrada
✅ Design responsivo

### Home (`/`)
✅ Lista de projetos em cards
✅ Botão criar novo projeto
✅ Modal de criação
✅ Visualização de status
✅ Data de criação
✅ Ações rápidas (Abrir/Excluir)
✅ Empty state quando sem projetos

### Chat (`/chat?project=ID`)
✅ Mensagens do usuário
✅ Mensagens do bot
✅ Botões de opções interativas
✅ Campo de entrada de texto
✅ Indicador de digitação
✅ Scroll automático
✅ Persistência de histórico por projeto
✅ Timestamps nas mensagens

### Projetos (`/projects`)
🔄 Em desenvolvimento
- Lista completa com filtros
- Ordenação
- Busca

### Configurações (`/settings`)
🔄 Em desenvolvimento
- Perfil do usuário
- Preferências
- Temas

## 🎨 Componentes Visuais

### Cards de Projeto
```
┌──────────────────────────────┐
│  📁                          │
│                              │
│  Nome do Projeto             │
│  Cliente XYZ                 │
│                              │
│  [✏️ Rascunho] 02/02/2026    │
│                              │
│  [Abrir]           [🗑️]      │
└──────────────────────────────┘
```

### Chat Bubble (Bot)
```
┌─────────────────────────────┐
│ 🤖                          │
│  ┌─────────────────────┐    │
│  │ Olá! Qual móvel     │    │
│  │ você deseja orçar?  │    │
│  └─────────────────────┘    │
│  10:30                      │
└─────────────────────────────┘
```

### Chat Bubble (Usuário)
```
┌─────────────────────────────┐
│                          👤 │
│    ┌─────────────────────┐  │
│    │ Guarda-roupa        │  │
│    └─────────────────────┘  │
│                      10:31  │
└─────────────────────────────┘
```

### Botões de Opção
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📏 Dimensão  │ │ 🎨 Cor       │ │ 🪵 Material  │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 📱 Responsividade

### Desktop (1920px+)
- Sidebar fixa de 280px
- Grid de 3-4 cards por linha
- Chat com 80% largura máxima

### Laptop (1366px)
- Sidebar fixa de 280px
- Grid de 2-3 cards por linha
- Chat com 90% largura máxima

### Tablet (768px)
- Sidebar escondível
- Grid de 2 cards por linha
- Chat com 100% largura

### Mobile (375px)
- Sidebar em menu hamburguer
- Grid de 1 card por linha
- Chat fullscreen

## ✨ Animações

### Entrada de Página
- Fade in + Slide up
- Duração: 0.3s
- Easing: ease-out

### Hover em Cards
- Transform: translateY(-2px)
- Box shadow aumentada
- Duração: 0.2s

### Mensagens do Chat
- Fade in + Slide up
- Duração: 0.3s
- Scroll automático suave

### Botões
- Transform: translateY(-1px) no hover
- Transition: all 0.2s ease

## 🔔 Feedback Visual

### Sucesso
- ✅ Ícone verde
- Borda verde sutil
- Animação de check

### Erro
- ❌ Ícone vermelho
- Fundo vermelho claro
- Borda vermelha

### Loading
- Indicador de digitação (3 dots)
- Spinner nos botões
- Skeleton screens

### Empty States
- Ícone grande centralizado
- Mensagem explicativa
- Call-to-action claro

---

**Sistema completo, profissional e pronto para uso!** 🚀
