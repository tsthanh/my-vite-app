import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-vite-app/', // ⚠️ rất quan trọng
  server: {
    proxy: {
      '/api': {
        target: 'https://192.168.30.101:8090',
        changeOrigin: true,
        secure: false, // nếu dùng https mà self-signed
      }
    }
  }
});
