# Legal AI Assistant ⚖️

Software jurídico com IA para advogados — Análise de documentos, geração de petições, pesquisa jurídica (Web + Mobile)

---

## 🎭 Demo Mode

Este repositório inclui uma versão demo completa que funciona 100% no frontend com dados mockados — sem necessidade de backend, APIs ou banco de dados.

### Acesso Rápido

| Ambiente | URL |
|----------|-----|
| 🌐 **Demo ao Vivo** | **https://leojnf.github.io/legal-ai-assistant/** |
| Local | http://localhost:5173 |

### O que funciona na Demo

- ✅ **Autenticação** — Login/cadastro com qualquer email e senha
- ✅ **Dashboard** — Estatísticas e atividades recentes mockadas
- ✅ **Análise de Documentos** — Upload simulado com análise de cláusulas, riscos e score
- ✅ **Gerador de Petições** — 6 templates (cível, trabalhista, constitucional, família, criminal) + download
- ✅ **Pesquisa Jurídica** — Jurisprudência, legislação e doutrina mockadas
- ✅ **Gestão de Prazos** — CRUD completo com persistência em localStorage
- ✅ **Assistente Virtual** — Chatbot com respostas sobre direito brasileiro

### Rodando a Demo Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/LeoJNF/legal-ai-assistant.git
cd legal-ai-assistant

# 2. Instale as dependências
cd apps/web
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

**Credenciais de demo:** qualquer email e senha funcionam.

### Build de Produção

```bash
cd apps/web
npm run build
npm run preview
```

### Alternando para Modo Real

Para usar APIs reais (GPT-4, banco de dados, etc), modifique `apps/web/.env`:

```env
VITE_DEMO_MODE=false
VITE_API_URL=https://sua-api.com
```

---

## Estrutura do Projeto

```
apps/
└── web/                    # App React + Vite + TypeScript
    └── src/
        ├── config/
        │   └── demo.ts     # Toggle demo/production
        ├── services/
        │   ├── mockData.ts  # Dados mockados realistas
        │   ├── mockApi.ts   # API mockada com delays simulados
        │   └── api.ts       # Export condicional (mock ou real)
        ├── components/
        │   ├── DemoBanner.tsx
        │   ├── Layout.tsx
        │   └── Spinner.tsx
        ├── contexts/
        │   └── AuthContext.tsx
        └── pages/
            ├── Login.tsx
            ├── Dashboard.tsx
            ├── Documents.tsx
            ├── Petitions.tsx
            ├── Search.tsx
            ├── Deadlines.tsx
            └── Chat.tsx
```

## Deploy na Vercel

O arquivo `apps/web/vercel.json` já está configurado:

```bash
# Via Vercel CLI
npm i -g vercel
cd apps/web
vercel --prod
```

Ou conecte o repositório no [dashboard da Vercel](https://vercel.com) com as configurações:
- **Root Directory:** `apps/web`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Env:** `VITE_DEMO_MODE=true`

---

> **Nota:** A versão demo é apenas para demonstração visual. Para recursos reais de IA (GPT-4, análise com NLP, etc), configure as APIs no modo production.
