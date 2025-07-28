// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ CRUCIAL: makes all paths relative
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
