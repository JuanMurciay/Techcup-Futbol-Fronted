import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './apiError';
import type { ApiEnvelope, ApiErrorKind } from '../types/api/common';

/** Base URL para peticiones Axios (`/api/...`). En dev suele ser '' para usar el proxy de Vite. */
export function resolveApiBaseURL(): string {
  const env = import.meta.env.VITE_API_URL;
  if (typeof env === 'string' && env.trim()) return env.replace(/\/$/, '');
  if (import.meta.env.DEV) return '';
  return 'https://localhost:8443';
}

const apiClient = axios.create({
  baseURL: resolveApiBaseURL(),
  timeout: 15000,
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
    } catch {
      // Ignore corrupted local storage payloads and continue request without token.
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'data' in (payload as ApiEnvelope<unknown>)) {
      const envelope = payload as ApiEnvelope<unknown>;
      return { ...response, data: envelope.data };
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError('La solicitud excedió el tiempo de espera.', 'TIMEOUT'));
    }

    if (!error.response && error.message === 'Network Error') {
      return Promise.reject(
        new ApiError(
          'Sin conexión con el servidor. En desarrollo usa `npm run dev` (proxy a HTTPS) o define VITE_API_URL. Comprueba que el back esté en marcha.',
          'NETWORK',
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
      return Promise.reject(new ApiError(message, 'AUTH', 401, data));
    }

    const kind: ApiErrorKind =
      error.response?.status && error.response.status >= 400 && error.response.status < 500 ? 'BUSINESS' : 'UNKNOWN';
    return Promise.reject(new ApiError(message, kind, error.response?.status, data));
  },
);

export default apiClient;
