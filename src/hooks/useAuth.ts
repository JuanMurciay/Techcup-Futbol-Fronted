import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import type { AuthUser } from '../types';
import { dashboardPath, normalizeRole } from '../utils/roles';
import { flushPendingTeamCreate } from '../utils/pendingTeam';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = useCallback((): AuthUser | null => {
    const raw = localStorage.getItem('tc_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }, []);

  const user = getUser();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await AuthService.login({ email, password });
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const rawRole: string =
          payload.role ?? payload.authorities?.[0]?.replace('ROLE_', '') ?? 'PLAYER';
        const role = normalizeRole(rawRole);
        const authUser: AuthUser = { email: data.email, role, token: data.token };
        localStorage.setItem('tc_user', JSON.stringify(authUser));
        const pending = await flushPendingTeamCreate();
        if (pending === 'fail') {
          setError('Sesión iniciada, pero no se pudo crear el equipo.');
        }
        navigate(dashboardPath(role));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('tc_user');
    navigate('/login');
  }, [navigate]);

  return { user, login, logout, loading, error };
}
