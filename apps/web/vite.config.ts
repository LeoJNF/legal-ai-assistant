import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// On GitHub Pages the app lives at /legal-ai-assistant/; everywhere else use /
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
