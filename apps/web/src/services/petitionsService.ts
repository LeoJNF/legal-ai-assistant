import api from './api';
import type { Petition, GeneratePetitionRequest, PetitionTemplate } from '@legal-ai/shared';

export const petitionsService = {
  list: async (): Promise<Petition[]> => {
    const response = await api.get<{ success: boolean; data: Petition[] }>('/api/petitions');
    return response.data.data!;
  },

  templates: async (): Promise<PetitionTemplate[]> => {
    const response = await api.get<{ success: boolean; data: PetitionTemplate[] }>('/api/petitions/templates');
    return response.data.data!;
  },

  get: async (id: string): Promise<Petition> => {
    const response = await api.get<{ success: boolean; data: Petition }>(`/api/petitions/${id}`);
    return response.data.data!;
  },

  generate: async (data: GeneratePetitionRequest): Promise<Petition> => {
    const response = await api.post<{ success: boolean; data: Petition }>('/api/petitions/generate', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Petition>): Promise<Petition> => {
    const response = await api.put<{ success: boolean; data: Petition }>(`/api/petitions/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/petitions/${id}`);
  },
};
