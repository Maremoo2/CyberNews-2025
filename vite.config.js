import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/CyberNews-2025/' : '/', // Base path for GitHub Pages
  publicDir: 'public',  // Ensure public folder is recognized
  build: {
    outDir: 'dist',
    copyPublicDir: true  // Ensure public folder is copied to dist
  },
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString().split('T')[0])
  }
}))
