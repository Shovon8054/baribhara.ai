import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // Use explicit IPv4 127.0.0.1 to avoid IPv6 ECONNREFUSED on Node 18+
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:8081',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
