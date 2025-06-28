import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/comparator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          parsers: ['js-yaml', '@ltd/j-toml', 'fast-xml-parser', 'papaparse'],
          diff: ['json-diff-ts', 'react-diff-viewer-continued']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
