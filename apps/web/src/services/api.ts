import { DEMO_MODE } from '@/config/demo';
import * as mockApi from './mockApi';

// In demo mode, use the mock API; in production, swap in a real API implementation.
export const api = mockApi;
export { DEMO_MODE };
