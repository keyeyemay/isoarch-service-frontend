import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxy = {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
  '/s3': {
    target: 'http://localhost:9000',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/s3/, ''),
  },
}

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    port: 3000,
    strictPort: true,
    proxy,
  },
  preview: {
    port: 3000,
    strictPort: true,
    proxy,
  },
})
