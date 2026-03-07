export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  conversationId: string;
  message: ChatMessage;
}

export interface LegalSearchRequest {
  query: string;
  type?: 'JURISPRUDENCIA' | 'LEGISLACAO' | 'ALL';
  limit?: number;
}

export interface LegalSearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  relevanceScore: number;
  url?: string;
}
