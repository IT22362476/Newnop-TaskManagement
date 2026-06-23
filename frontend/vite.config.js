import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Timeout & error handling — show a helpful message if backend is down
        timeout: 10000,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error(
              '\n❌ Backend proxy error — is the backend server running on port 5000?',
              err.message
            );
          });
        },
      },
    },
  },
});
