# Legal AI Assistant 🤖⚖️

Software jurídico com IA para advogados - Análise de documentos, geração de petições, pesquisa jurídica (Web + Mobile)

## 📋 Sobre o Projeto

O Legal AI Assistant é uma aplicação completa para auxiliar profissionais da área jurídica com:

- **📄 Análise de Documentos**: Analise contratos e documentos legais com IA, identificando riscos, pontos-chave e recomendações
- **⚖️ Geração de Petições**: Gere petições e documentos jurídicos profissionais a partir de templates
- **🔍 Pesquisa Jurídica**: Pesquise jurisprudências e casos relevantes com busca inteligente

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/LeoJNF/legal-ai-assistant.git
cd legal-ai-assistant
```

2. Instale as dependências:
```bash
cd apps/web
npm install
```

### Executar em Modo Desenvolvimento

```bash
cd apps/web
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

### Build para Produção

```bash
cd apps/web
npm run build
npm run preview
```

## 💡 Modo Demo

A aplicação está configurada para rodar em **modo demonstração** por padrão. Neste modo:

- Todos os serviços utilizam dados fictícios (mock data)
- Nenhum dado real é processado ou armazenado
- Todas as funcionalidades estão disponíveis para teste
- As respostas são simuladas com delays realistas

O modo demo é controlado pela variável de ambiente `VITE_DEMO_MODE=true` no arquivo `apps/web/.env`.

## 🎯 Funcionalidades Disponíveis

### 1. Análise de Documentos
- Upload de arquivos PDF, DOC e DOCX
- Resumo automático do documento
- Identificação de pontos-chave
- Detecção de riscos jurídicos
- Recomendações de melhorias

### 2. Geração de Petições
- Múltiplos templates profissionais:
  - Petição Inicial - Ação de Cobrança
  - Recurso de Apelação
  - Contestação
  - Habeas Corpus
  - Mandado de Segurança
- Formulário guiado para preenchimento
- Geração automática com IA

### 3. Pesquisa Jurídica
- Busca inteligente de jurisprudências
- Resultados ordenados por relevância
- Informações detalhadas de cada caso
- Metadados (tribunal, data, etc.)

## 🏗️ Estrutura do Projeto

```
legal-ai-assistant/
├── apps/
│   └── web/                 # Aplicação web React + Vite
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── pages/       # Páginas da aplicação
│       │   ├── services/    # Serviços e API
│       │   ├── types/       # Definições TypeScript
│       │   └── config/      # Configurações
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── package.json             # Configuração do monorepo
├── pnpm-workspace.yaml
└── turbo.json
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Navegação
- **CSS Modules** - Estilização

## 📱 Páginas Disponíveis

- `/` - Página inicial com visão geral dos serviços
- `/document-analysis` - Análise de documentos
- `/petition-generator` - Geração de petições
- `/legal-research` - Pesquisa jurídica

## 🎨 Visual e Interface

A aplicação possui:
- Design moderno e profissional
- Interface responsiva (mobile-friendly)
- Suporte a modo claro e escuro
- Animações e transições suaves
- Feedback visual durante operações

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Compila para produção
npm run preview      # Preview da build de produção

# Linting
npm run lint         # Executa o linter
```

## 🧪 Como Testar

Para um guia completo de testes de todas as funcionalidades, consulte o [Guia de Testes](TESTING_GUIDE.md).

Resumo rápido:
1. `cd apps/web && npm install`
2. `npm run dev`
3. Acesse http://localhost:3000
4. Teste cada serviço clicando nos cards da página inicial

## 🔒 Observações de Segurança

Em modo demo:
- Nenhum dado é enviado para servidores externos
- Todos os processamentos são locais
- Dados fictícios são usados para demonstração

Para uso em produção, será necessário:
- Configurar backend real
- Implementar autenticação
- Configurar armazenamento de dados
- Adicionar medidas de segurança apropriadas

## 📄 Licença

Este projeto está em desenvolvimento e é fornecido para fins de demonstração.

## 👥 Suporte

Para dúvidas ou suporte, entre em contato através do repositório no GitHub.

---

**Legal AI Assistant** - Transformando a prática jurídica com Inteligência Artificial 🤖⚖️
