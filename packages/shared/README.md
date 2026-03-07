# @legal-ai/shared

Pacote compartilhado com tipos TypeScript, validadores Zod, constantes e funções utilitárias usadas por todos os apps.

## Conteúdo

- **types/** - Interfaces e tipos TypeScript (User, Document, Petition, Deadline, Chat, API)
- **validators/** - Schemas de validação Zod
- **constants/** - Constantes do projeto (tipos de petição, status, etc)
- **utils/** - Funções utilitárias (formatação de datas, cálculo de prazos, etc)

## Uso

```typescript
import { User, Deadline, loginSchema, formatDate, daysUntilDeadline } from '@legal-ai/shared';
```

## Build

```bash
pnpm build
```
