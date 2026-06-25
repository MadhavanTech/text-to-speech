import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/text-to-speech/',  // ← change this to match your repo name
  plugins: [react(), tailwindcss()],
})
