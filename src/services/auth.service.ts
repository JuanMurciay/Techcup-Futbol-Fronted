import apiClient from './apiClient';
import type { LoginRequest } from '../types';

function unwrapPayload(body: unknown): Record<string, unknown> {
  if (body && typeof body === 'object' && 'data' in body) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === 'object') return inner as Record<string, unknown>;
  }
  return (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
}

const AuthService = {
  login: async (data: LoginRequest) => {
    const res = await apiClient.post<unknown>('/api/v1/auth/login', data);
    const p = unwrapPayload(res.data);
    const token = (p.token ?? p.accessToken) as string | undefined;
    const email = (p.email as string | undefined) ?? data.email;
    if (!token) {
      const msg =
        typeof (res.data as { message?: string })?.message === 'string'
          ? (res.data as { message: string }).message
          : 'Respuesta de login inválida (sin token)';
      throw new Error(msg);
    }
    return { token, email, type: String(p.type ?? '') };
  },
};

export default AuthService;