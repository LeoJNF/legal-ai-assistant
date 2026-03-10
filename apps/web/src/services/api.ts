import { config } from '@/config/demo';
import { mockApi } from './mockApi';

// If demo mode is enabled, use mock API, otherwise use real API
export const api = config.demoMode ? mockApi : mockApi; // For now, always use mock

export default api;
