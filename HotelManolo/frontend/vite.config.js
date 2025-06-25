import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ocr': 'http://localhost:5002',
      '/albaranes': 'http://localhost:5002',
      '/uploads': 'http://localhost:5002',
      '/login': 'http://localhost:5002',
      '/logout': 'http://localhost:5002',
    },
  },
});
