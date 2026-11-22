import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Carrega variáveis do arquivo .env ou do ambiente do processo (Docker)
  const env = loadEnv(mode, process.cwd(), '')
  
  // No Docker Compose: usa VITE_BACKEND_URL configurada no container (http://backend:3001)
  // No desenvolvimento local (npm run dev:all): usa o fallback padrão (http://localhost:3001)
  const backendUrl = env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL || 'http://localhost:3001'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
