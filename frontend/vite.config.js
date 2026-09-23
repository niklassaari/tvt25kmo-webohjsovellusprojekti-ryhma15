import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
//MUUTA IP:ksi kun alat testailemaan en tiiä miksi mutta jos on http://128.214.255.200:3001/ rikkoo etusivun ja elokuvien haun
        target: process.env.VITE_BACKEND_URL || 'http://backend:3001',
        changeOrigin: true,
      },
    },
  },
});

