import { useState } from 'react';
import PlayerService from '../services/player.service';
import type { PlayerRegistrationRequest } from '../types';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const register = async (payload: PlayerRegistrationRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await PlayerService.register(payload);
      setSuccess('Registro completado correctamente. Ahora puedes iniciar sesión.');
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo completar el registro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
}
