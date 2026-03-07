# @legal-ai/web

Aplicação web do Legal AI Assistant.

## Tecnologias

- React 18 + TypeScript
- Vite como build tool
- Tailwind CSS para estilização
- Zustand para estado global
- React Hook Form + Zod para formulários
- Axios para chamadas HTTP
- React Router v6 para navegação

## Configuração

```bash
# Crie o arquivo .env.local
echo "VITE_API_URL=http://localhost:3000" > .env.local
```

## Desenvolvimento

```bash
pnpm dev  # Inicia em http://localhost:5173
```

## Build

```bash
pnpm build
```

## Páginas

- `/login` - Login
- `/register` - Cadastro
- `/dashboard` - Dashboard principal
- `/documents` - Análise de documentos
- `/petitions` - Gerador de petições
- `/search` - Pesquisa jurídica
- `/deadlines` - Gestão de prazos
- `/chat` - Assistente virtual
