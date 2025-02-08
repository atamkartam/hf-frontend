import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['0488-114-10-146-174.ngrok-free.app'], // Tambahkan host ngrok di sini
  },
});
