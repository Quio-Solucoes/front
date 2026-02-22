# Boa Vista Frontend

Frontend web do sistema de orcamentos de moveis planejados, construido com Next.js (App Router), TypeScript e arquitetura orientada a features.

## Visao Geral

Este projeto entrega:

- autenticacao local para ambiente de desenvolvimento
- dashboard da conta (Home) com indicadores e visao de projetos
- gestao de projetos com criacao, exclusao e acesso ao chat
- chat por projeto com historico persistido
- suporte a resposta com PDF no chat (botao de download)
- sidebar de orcamento integrada ao chat (itens, total, edicao de componentes, exclusao)
- tema light/dark com tokens centralizados e branding configuravel
- reconhecimento de voz no chat (Web Speech API)

## Stack Tecnologica

- Next.js 16 (App Router)
- React 19
- TypeScript
- Zustand (estado local/persistencia)
- TanStack React Query (camada async/mutations)
- Axios
- Lucide React

## Arquitetura

O projeto utiliza separacao por responsabilidades com foco em feature modules:

- `src/app`: roteamento, layouts e BFF/proxy (rotas API internas)
- `src/features`: regras de negocio e UI por dominio funcional
- `src/entities`: tipos de dominio
- `src/shared`: infraestrutura compartilhada (UI base, tema, providers, cliente HTTP)

### Estrutura principal

```txt
src/
  app/
    (private)/
    api/
      chat/route.ts
      orcamento/[...path]/route.ts
  features/
    auth/
    home/
    projects/
    chat/
    orcamento/
  entities/
    user/
    project/
    chat/
  shared/
    api/
    providers/
    theme/
    ui/
```

## Rotas da Aplicacao

- `/login`: tela de login
- `/`: dashboard da conta (Home)
- `/projects`: gestao de projetos
- `/chat`: resolve automaticamente para ultimo projeto disponivel
- `/chat/[projectId]`: chat do projeto + sidebar de orcamento
- `/settings`: tela de configuracoes (placeholder)

## Integracao com Backend

O frontend usa rotas internas (`/api/*`) como camada BFF/proxy.

### Chat

- endpoint interno: `POST /api/chat`
- backend alvo: resolvido por configuracao de ambiente (local/aws)

Payload esperado (frontend -> backend):

```json
{
  "message": "texto",
  "session_id": "projectId"
}
```

Resposta suportada:

```json
{
  "response": "texto do bot",
  "options": [{ "id": "opcao", "label": "Opcao" }],
  "pdf_ready": true,
  "pdf_filename": "arquivo.pdf",
  "download_url": "/download-pdf/session"
}
```

Se o backend estiver indisponivel, existe fallback controlado na rota interna `/api/chat`.

### Orcamento

- endpoint interno: `/api/orcamento/[...path]`
- proxy para backend: `${origin(backend_chat_url_resolvido)}/orcamento/...`

Fluxos suportados na sidebar:

- consultar orcamento da sessao
- remover movel
- listar opcoes de componente
- atualizar componente
- download de PDF final

## Gestao de Estado

- `features/auth/model/auth-store.ts`
  - sessao local persistida (`quio-auth`)
- `features/projects/model/projects-store.ts`
  - projetos persistidos (`quio-projects`)
  - flag de hidratacao para evitar comportamento inconsistente em `/chat`
- `features/chat/model/chat-store.ts`
  - historico de mensagens por projeto (`quio-chat`)
  - migracao de versao aplicada para texto inicial

## Tema e Branding

Sistema de design token centralizado:

- `src/shared/theme/theme-config.ts`: cores, tipografia, espacos, sombras, motion
- `src/shared/theme/theme-style.tsx`: injecao de CSS variables
- `src/shared/theme/brand-config.ts`: nome da marca e logos por tema

### Regras atuais de marca

- botao primario: `#447187`
- tipografia principal: Inter
  - titulos/destaques: bold/black
  - textos corridos: regular/medium

## Como Rodar Localmente

### Pre requisitos

- Node.js 20+
- npm 10+

### Passos

```bash
npm install
npm run dev
```

Aplicacao: `http://localhost:3000`

## Variaveis de Ambiente

A resolucao do backend segue esta ordem de prioridade:

1. `BACKEND_CHAT_URL` (override explicito)
2. `BACKEND_PROVIDER=aws` usa `BACKEND_CHAT_URL_AWS` (fallback para local se ausente)
3. `BACKEND_PROVIDER=local` usa `BACKEND_CHAT_URL_LOCAL`
4. fallback final: `http://localhost:5001/chat`

### Exemplo para desenvolvimento local

```env
BACKEND_PROVIDER=local
BACKEND_CHAT_URL_LOCAL=http://localhost:5001/chat
```

### Exemplo para main/producao (AWS)

```env
BACKEND_PROVIDER=aws
BACKEND_CHAT_URL_AWS=https://seu-dominio-ou-api-gateway/chat
```

### Override direto (qualquer ambiente)

```env
BACKEND_CHAT_URL=https://endpoint-especifico/chat
```

## Scripts Disponiveis

```bash
npm run dev    # ambiente de desenvolvimento
npm run build  # build de producao
npm run start  # servidor de producao
npm run lint   # validacao de lint
```

## Decisoes Tecnicas Importantes

- App Router com layouts segmentados (`(private)` para area autenticada)
- BFF/proxy interno para desacoplar frontend de CORS e detalhes de backend
- feature modules com `index.ts` como API publica de cada dominio
- persistencia local para acelerar iteracao e testes funcionais

## Limitacoes Atuais

- autenticacao atual e local (nao server-side), indicada para ambiente de desenvolvimento/MVP
- nao ha suite de testes automatizados (unit/integration/e2e)
- alguns textos legados no codigo ainda podem estar com encoding inconsistentes e devem ser normalizados em UTF-8

## Proximos Passos Recomendados

1. implementar autenticacao real com cookie HttpOnly e middleware server-side
2. adicionar testes de fluxo critico (login, projetos, chat, orcamento)
3. padronizar encoding UTF-8 em todos os arquivos de UI
4. evoluir dashboard com metricas reais por periodo (7/30/90 dias)
