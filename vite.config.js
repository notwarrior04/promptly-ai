import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/promptly-ai/', // 👈 this line is required for GitHub Pages
  plugins: [react()],
})
