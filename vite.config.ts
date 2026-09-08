import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = 'https://rewear-final-p.onrender.com'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
