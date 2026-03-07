import api from './api';
import type { Deadline, CreateDeadlineRequest } from '@legal-ai/shared';

export const deadlinesService = {
  list: async (): Promise<Deadline[]> => {
    const response = await api.get<{ success: boolean; data: Deadline[] }>('/api/deadlines');
    return response.data.data!;
  },

  get: async (id: string): Promise<Deadline> => {
    const response = await api.get<{ success: boolean; data: Deadline }>(`/api/deadlines/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateDeadlineRequest): Promise<Deadline> => {
    const response = await api.post<{ success: boolean; data: Deadline }>('/api/deadlines', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Deadline>): Promise<Deadline> => {
    const response = await api.put<{ success: boolean; data: Deadline }>(`/api/deadlines/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/deadlines/${id}`);
  },
};
