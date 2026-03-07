import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';

let chatModel: ChatOpenAI | null = null;
let embeddingsModel: OpenAIEmbeddings | null = null;

export function getChatModel(modelName = 'gpt-4-turbo'): ChatOpenAI {
  if (!chatModel) {
    chatModel = new ChatOpenAI({
      modelName,
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  return chatModel;
}

export function getEmbeddingsModel(): OpenAIEmbeddings {
  if (!embeddingsModel) {
    embeddingsModel = new OpenAIEmbeddings({
      modelName: 'text-embedding-ada-002',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  return embeddingsModel;
}
