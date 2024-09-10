import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias for pdf.worker.min.js
      'pdfjs-dist/build/pdf.worker.min.js': resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js')
    }
  }
})
