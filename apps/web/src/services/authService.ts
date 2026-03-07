import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@legal-ai/shared';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/api/auth/login', data);
    return response.data.data!;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/api/auth/register', data);
    return response.data.data!;
  },

  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data.data;
  },
};
