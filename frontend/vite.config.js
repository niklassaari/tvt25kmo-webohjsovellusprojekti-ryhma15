import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    host: true, // Sallii ulkoiset yhteydet VM:llä
    proxy: {
      '/api': {
      
        target: process.env.VITE_BACKEND_URL || 'http://backend:3001',
=======
    host: true,
    proxy: {
      '/api': {

        target: process.env.VITE_BACKEND_URL || 'http://128.214.255.200:3001/',
>>>>>>> origin/NiklasBranch
        changeOrigin: true,
      },
    },
  },
<<<<<<< HEAD
});

=======
})
>>>>>>> origin/NiklasBranch
