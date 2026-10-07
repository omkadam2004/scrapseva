
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows process.env.API_KEY to be referenced without crashing locally.
    // In a local setup, you would typically use a .env file.
    'process.env': {
      API_KEY: JSON.stringify(process.env.VITE_GEMINI_API_KEY || '')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
