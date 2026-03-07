import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getChatModel } from '../langchain/config';
import { LEGAL_CHATBOT_SYSTEM_PROMPT } from '../prompts';
import type { ChatMessage } from '@legal-ai/shared';

export interface ChatSession {
  messages: ChatMessage[];
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const model = getChatModel();

  const historyText = history
    .slice(-10)
    .map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
    .join('\n');

  const systemPrompt = LEGAL_CHATBOT_SYSTEM_PROMPT.replace('{history}', historyText);

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(message),
  ]);

  return response.content as string;
}
