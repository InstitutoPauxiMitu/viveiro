import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicione a base da URL para a sua aplicação
  base: '/', 
  build: {
    // A pasta de saída do build
    outDir: 'dist',
  }
})
