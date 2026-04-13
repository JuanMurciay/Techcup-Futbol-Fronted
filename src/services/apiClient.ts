import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8443',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Inyectar token en cada request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const raw = localStorage.getItem('tc_user');
  if (raw) {
    try {
      const user = JSON.parse(raw) as { token?: string };
      if (user.token) {
        config.headers.set('Authorization', `Bearer ${user.token}`);
      }
    } catch {
      // token malformado, ignorar
    }
  }
  return config;
});

// Manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
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