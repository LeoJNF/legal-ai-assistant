import api from './api';
import type { Document, UploadDocumentRequest, DocumentAnalysis } from '@legal-ai/shared';

export const documentsService = {
  list: async (): Promise<Document[]> => {
    const response = await api.get<{ success: boolean; data: Document[] }>('/api/documents');
    return response.data.data!;
  },

  get: async (id: string): Promise<Document> => {
    const response = await api.get<{ success: boolean; data: Document }>(`/api/documents/${id}`);
    return response.data.data!;
  },

  upload: async (file: File, data: UploadDocumentRequest): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title);
    formData.append('type', data.type);

    const response = await api.post<{ success: boolean; data: Document }>(
      '/api/documents/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data!;
  },

  analyze: async (id: string): Promise<DocumentAnalysis> => {
    const response = await api.post<{ success: boolean; data: DocumentAnalysis }>(
      `/api/documents/${id}/analyze`
    );
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/documents/${id}`);
  },
};
