import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3001,
    open: true,
    proxy: {
      // Puerto 9000 - Credit Card Service (tarjetas)
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
      },
      // Puerto 9093 - Operations Service (tarjetas activas, operaciones)
      '/operations-api': {
        target: 'http://localhost:9093',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/operations-api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
