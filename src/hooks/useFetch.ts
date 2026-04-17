import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../services/apiError';

export function useFetch<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await fetchFn();
      setData(result);
      setSuccess('Consulta completada correctamente.');
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.kind === 'NETWORK' ? `Error de red: ${e.message}` : e.message);
      } else {
        setError(e instanceof Error ? e.message : 'Error al cargar datos');
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, success, refetch: execute };
}
