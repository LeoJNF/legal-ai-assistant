# @legal-ai/api

Backend da API REST do Legal AI Assistant.

## Tecnologias

- Node.js 20 + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT para autenticação
- Multer para upload de arquivos
- Winston para logs
- Integração com @legal-ai/ai para funcionalidades de IA

## Configuração

```bash
cp .env.example .env
# Configure as variáveis de ambiente
```

## Desenvolvimento

```bash
pnpm dev  # Inicia em modo desenvolvimento com hot reload
```

## Build

```bash
pnpm build
```

## Banco de dados

```bash
pnpm prisma:generate  # Gera o Prisma Client
pnpm prisma:migrate   # Executa migrações
pnpm prisma:studio    # Abre o Prisma Studio
```

## Testes

```bash
pnpm test
```

## Endpoints

Veja o [README principal](../../README.md) para documentação completa da API.
