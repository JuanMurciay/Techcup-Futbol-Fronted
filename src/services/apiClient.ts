import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

function resolveBaseURL(): string {
  const env = import.meta.env.VITE_API_URL;
  if (typeof env === 'string' && env.trim()) return env.replace(/\/$/, '');
  if (import.meta.env.DEV) return '';
  return 'https://localhost:8443';
}

const apiClient = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const raw = localStorage.getItem('tc_user');
  if (raw) {
    try {
      const user = JSON.parse(raw) as { token?: string };
      if (user.token) {
        config.headers.set('Authorization', `Bearer ${user.token}`);
      }
    } catch {}
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && error.message === 'Network Error') {
      return Promise.reject(
        new Error(
          'Sin conexión con el servidor. En desarrollo usa `npm run dev` (proxy a HTTPS) o define VITE_API_URL. Comprueba que el back esté en marcha.',
        ),
      );
    }

    const data = error.response?.data as Record<string, unknown> | undefined;
    const message =
      (typeof data?.message === 'string' ? data.message : undefined) ??
      (typeof data?.error === 'string' ? data.error : undefined) ??
      error.message ??
      'Error desconocido';

    if (error.response?.status === 401) {
      localStorage.removeItem('tc_user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  },
);

export default apiClient;