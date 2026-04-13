import apiClient from './apiClient';
import type { LoginRequest } from '../types';

const AuthService = {
  login: async (data: LoginRequest) => {
    const res = await apiClient.post('/api/v1/auth/login', data);
    return res.data as { token: string; email: string; type: string };
  },
};

export default AuthService;