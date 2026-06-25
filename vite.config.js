import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/text-to-speech/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/convert': {
        target: 'https://dac-final-50043363970.development.catalystappsail.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
