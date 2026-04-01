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
      // Puerto 9092 - Credit Card Service (operaciones/active)
      '/operations-api': {
        target: 'http://localhost:9092',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
