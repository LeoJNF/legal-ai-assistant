import api from './api';
import type { ChatResponse, SendMessageRequest, LegalSearchRequest, LegalSearchResult } from '@legal-ai/shared';

export const chatService = {
  sendMessage: async (data: SendMessageRequest): Promise<ChatResponse> => {
    const response = await api.post<{ success: boolean; data: ChatResponse }>('/api/chat/message', data);
    return response.data.data!;
  },

  getConversations: async () => {
    const response = await api.get('/api/chat/conversations');
    return response.data.data;
  },

  getConversation: async (id: string) => {
    const response = await api.get(`/api/chat/conversations/${id}`);
    return response.data.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(`/api/chat/conversations/${id}`);
  },
};

export const searchService = {
  search: async (data: LegalSearchRequest): Promise<LegalSearchResult[]> => {
    const response = await api.post<{ success: boolean; data: LegalSearchResult[] }>('/api/search', data);
    return response.data.data!;
  },
};
