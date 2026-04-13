import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  /** En dev, el front llama a /api/... y Vite reenvía al back (evita CORS y HTTPS autofirmado en el navegador). */
  const apiTarget = env.VITE_DEV_API_PROXY || 'https://localhost:8443';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
