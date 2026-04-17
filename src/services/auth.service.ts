import { httpPost } from './http';
import type { LoginRequestDTO, AuthResponseDTO } from '../types/api/auth';

const AuthService = {
  login: async (data: LoginRequestDTO): Promise<AuthResponseDTO> => {
    const p = await httpPost<Record<string, unknown>, LoginRequestDTO>('/api/v1/auth/login', data);
    const token = (p.token ?? p.accessToken) as string | undefined;
    const email = (p.email as string | undefined) ?? data.email;
    if (!token) {
      throw new Error('Respuesta de login inválida (sin token)');
    }
    return { token, email, type: String(p.type ?? '') };
  },
};

export default AuthService;
