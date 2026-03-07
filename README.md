# ⚖️ Legal AI Assistant

**Software jurídico completo com Inteligência Artificial** para advogados — acelere seu trabalho com análise de documentos, geração de petições, pesquisa jurídica, gestão de prazos e assistente virtual, disponível em Web e Mobile.

---

## 🚀 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📄 **Análise de Documentos** | Upload de PDF/DOCX, análise com GPT-4, extração de cláusulas, identificação de riscos |
| ⚖️ **Gerador de Petições** | Geração automática de petições jurídicas com IA conforme normas ABNT |
| 🔍 **Pesquisa Jurídica** | Busca semântica em legislação e jurisprudência brasileira |
| 📅 **Gestão de Prazos** | Calendário jurídico, alertas automáticos, contagem de dias úteis |
| 🤖 **Assistente Virtual** | Chatbot com conhecimento em direito brasileiro |

---

## 🏗️ Arquitetura

```
legal-ai-assistant/
├── apps/
│   ├── web/          # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── mobile/       # React Native + Expo + TypeScript
│   └── api/          # Node.js + Express + TypeScript + Prisma
├── packages/
│   ├── shared/       # Tipos, validadores, constantes e utilitários
│   ├── ai/           # Módulos de IA (Langchain, OpenAI, Pinecone)
│   └── ui/           # Componentes UI compartilhados
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🛠️ Stack Tecnológica

### Frontend Web
- **React 18** + TypeScript + Vite
- **Tailwind CSS** para estilização
- **Zustand** para estado global
- **React Hook Form** + Zod para formulários
- **Axios** para chamadas HTTP
- **React Router v6** para navegação

### Mobile
- **React Native** + Expo
- **React Navigation** para navegação
- **NativeWind** (Tailwind para RN)

### Backend
- **Node.js 20** + Express + TypeScript
- **Prisma** + PostgreSQL
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **Winston** para logs

### Inteligência Artificial
- **OpenAI GPT-4 Turbo** para análise e geração de texto
- **Langchain** para orquestração
- **Pinecone** para busca vetorial
- **pdf-parse** e **mammoth** para processamento de documentos

### DevOps
- **Turborepo** para monorepo
- **pnpm** como gerenciador de pacotes
- **GitHub Actions** para CI/CD
- **ESLint** + Prettier para qualidade de código

---

## ⚡ Início Rápido

### Pré-requisitos
- Node.js 20+
- pnpm 8+
- PostgreSQL
- Chave da API OpenAI

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/LeoJNF/legal-ai-assistant.git
cd legal-ai-assistant
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
# Edite o arquivo .env com suas configurações
```

Variáveis necessárias:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/legal_ai
OPENAI_API_KEY=sk-...
JWT_SECRET=seu-segredo-jwt
```

### 3. Configurar o banco de dados

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Iniciar todos os serviços

```bash
pnpm dev
```

Acesse:
- **Web**: http://localhost:5173
- **API**: http://localhost:3000
- **API Health**: http://localhost:3000/health

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia todos os serviços em modo desenvolvimento |
| `pnpm build` | Build de todos os pacotes e apps |
| `pnpm lint` | Executa o linter em todo o projeto |
| `pnpm test` | Executa todos os testes |
| `pnpm db:migrate` | Executa as migrações do banco de dados |
| `pnpm db:generate` | Gera o Prisma client |
| `pnpm format` | Formata o código com Prettier |

---

## 🔌 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Dados do usuário autenticado |

### Documentos
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/documents` | Listar documentos |
| POST | `/api/documents/upload` | Upload de documento |
| POST | `/api/documents/:id/analyze` | Analisar documento com IA |
| DELETE | `/api/documents/:id` | Excluir documento |

### Petições
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/petitions` | Listar petições |
| GET | `/api/petitions/templates` | Listar templates |
| POST | `/api/petitions/generate` | Gerar petição com IA |
| PUT | `/api/petitions/:id` | Atualizar petição |
| DELETE | `/api/petitions/:id` | Excluir petição |

### Prazos
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/deadlines` | Listar prazos |
| POST | `/api/deadlines` | Criar prazo |
| PUT | `/api/deadlines/:id` | Atualizar prazo |
| DELETE | `/api/deadlines/:id` | Excluir prazo |

### Pesquisa
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/search` | Pesquisar jurisprudência e legislação |

### Chat
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/chat/message` | Enviar mensagem para o assistente |
| GET | `/api/chat/conversations` | Listar conversas |
| DELETE | `/api/chat/conversations/:id` | Excluir conversa |

---

## 🚀 Deploy

### Frontend Web (Vercel)
```bash
# Configure as secrets no GitHub:
# VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, VITE_API_URL
```

### API (Railway)
```bash
# Configure as secrets no GitHub:
# RAILWAY_TOKEN
# Configure as variáveis de ambiente no Railway
```

### Mobile (Expo EAS)
```bash
cd apps/mobile
npx eas build --platform all
```

---

## 🧪 Testes

```bash
# Todos os testes
pnpm test

# Testes de um pacote específico
pnpm --filter @legal-ai/shared test
```

---

## 🔒 Variáveis de Ambiente

Veja o arquivo `apps/api/.env.example` para todas as variáveis necessárias.

---

## 📱 App Mobile

O app mobile está disponível via **Expo Go**:
1. Instale o Expo Go no seu celular
2. Execute `pnpm --filter @legal-ai/mobile start`
3. Escaneie o QR code

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feat/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feat/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
