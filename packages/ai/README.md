# @legal-ai/ai

Módulos de Inteligência Artificial para o Legal AI Assistant.

## Módulos

- **document-analyzer** - Análise de documentos PDF/DOCX com GPT-4
- **petition-generator** - Geração de petições jurídicas com IA
- **legal-search** - Pesquisa semântica em legislação e jurisprudência
- **chatbot** - Assistente virtual com conhecimento jurídico
- **embeddings** - Geração e busca de embeddings com Pinecone
- **langchain** - Configuração do LangChain (ChatOpenAI, embeddings)

## Configuração

Configure as variáveis de ambiente:

```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=legal-documents
```

## Uso

```typescript
import { analyzeDocument, generatePetition, sendChatMessage, searchLegalContent } from '@legal-ai/ai';

// Analisar documento
const analysis = await analyzeDocument(buffer, 'application/pdf');

// Gerar petição
const content = await generatePetition({ type: 'INICIAL', ... });

// Chat
const response = await sendChatMessage('Qual o prazo recursal?', history);
```
