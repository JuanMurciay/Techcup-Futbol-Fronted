import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import type { AuthUser } from '../types';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = useCallback((): AuthUser | null => {
    const raw = localStorage.getItem('tc_user');
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; }
    catch { return null; }
  }, []);

  const user = getUser();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.login({ email, password });
      // Decodificar role del JWT payload
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role: string = payload.role ?? payload.authorities?.[0]?.replace('ROLE_', '') ?? 'JUGADOR';
      const authUser: AuthUser = { email: data.email, role, token: data.token };
      localStorage.setItem('tc_user', JSON.stringify(authUser));

      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'ORGANIZADOR') navigate('/organizer/dashboard');
      else navigate('/standings');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('tc_user');
    navigate('/login');
  }, [navigate]);

  return { user, login, logout, loading, error };
}