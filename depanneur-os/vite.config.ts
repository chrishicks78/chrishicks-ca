import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chrishicks-ca/depanneur-os/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
