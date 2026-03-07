import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getChatModel } from '../langchain/config';
import { LEGAL_SEARCH_PROMPT } from '../prompts';
import type { LegalSearchResult } from '@legal-ai/shared';

export async function searchLegalContent(
  query: string,
  type?: 'JURISPRUDENCIA' | 'LEGISLACAO' | 'ALL'
): Promise<LegalSearchResult[]> {
  const model = getChatModel();

  const systemPrompt = `Você é um especialista em direito brasileiro com conhecimento abrangente sobre legislação e jurisprudência.
Responda sempre em JSON válido.`;

  const userPrompt = `Pesquise sobre: "${query}"
Tipo de busca: ${type || 'ALL'}

Retorne os resultados mais relevantes no formato JSON:
[
  {
    "id": "string",
    "title": "string",
    "content": "string (resumo do conteúdo)",
    "source": "string (ex: STJ, STF, Lei nº X/XXXX)",
    "relevanceScore": number (0-1),
    "url": "string (opcional)"
  }
]

Forneça pelo menos 3 resultados relevantes sobre o tema pesquisado.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const content = response.content as string;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return [];
  }

  return JSON.parse(jsonMatch[0]) as LegalSearchResult[];
}
