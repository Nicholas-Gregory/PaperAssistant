import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/claude': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/claude/, '')
      }
    }
  }
})
