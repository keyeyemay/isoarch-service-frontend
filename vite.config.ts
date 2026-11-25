import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const REPO_NAME = 'isoarch-service-frontend'

const CERT_KEY = resolve(import.meta.dirname, 'cert/cert.key')
const CERT_CRT = resolve(import.meta.dirname, 'cert/cert.crt')
const hasCert = existsSync(CERT_KEY) && existsSync(CERT_CRT)

const https = hasCert
  ? { key: readFileSync(CERT_KEY), cert: readFileSync(CERT_CRT) }
  : undefined

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

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? `/${REPO_NAME}/` : '/',
  plugins: [
    react(),
    ...(hasCert ? [] : [basicSsl()]),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg', 'default_signature.png', 'default_signature.mp4'],
      manifest: {
        name: 'IsoArch — изотопные сигнатуры',
        short_name: 'IsoArch',
        description: 'Изотопные сигнатуры костных останков: δ¹³C, δ¹⁵N, рацион, фото и видео',
        lang: 'ru',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#FFFFFF',
        theme_color: '#CF3B3B',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp4,webmanifest}'],
        navigateFallbackDenylist: [/^\/api\//, /^\/s3\//],
      },
    }),
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    https,
    proxy,
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    https,
    proxy,
  },
}))
