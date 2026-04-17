import { useEffect, useMemo, useState } from 'react';
import { ApiError } from '../services/apiError';
import PlayerService from '../services/player.service';
import type { ProfileDTO } from '../types';
import { saveStoredProfilePhoto } from '../utils/profilePhoto';

interface ProfileFormValues {
  fullName: string;
  email: string;
  position: string;
  jerseyNumber: string;
}

type ProfileErrors = Partial<Record<keyof ProfileFormValues, string>>;

const POSITION_OPTIONS = ['Portero', 'Defensa', 'Volante', 'Delantero'] as const;

export function useProfileEditor(initialProfile: ProfileDTO | null, onSaved?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialProfile?.profilePhoto ?? null);

  const initialValues = useMemo<ProfileFormValues>(
    () => ({
      fullName: initialProfile?.fullName ?? '',
      email: initialProfile?.email ?? '',
      position: initialProfile?.position ?? 'Delantero',
      jerseyNumber: String(initialProfile?.jerseyNumber ?? 10),
    }),
    [initialProfile],
  );

  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setPhotoPreview(initialProfile?.profilePhoto ?? null);
  }, [initialValues]);

  const setField = (field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setError(null);
    setSuccess(null);
  };

  const validate = (): boolean => {
    const next: ProfileErrors = {};
    if (!values.fullName.trim()) next.fullName = 'El nombre es obligatorio.';
    if (!values.email.trim().includes('@')) next.email = 'Correo electrónico inválido.';
    if (!POSITION_OPTIONS.includes(values.position as (typeof POSITION_OPTIONS)[number])) {
      next.position = 'Selecciona una posición válida.';
    }
    const jersey = Number(values.jerseyNumber);
    if (!Number.isInteger(jersey) || jersey < 1 || jersey > 99) {
      next.jerseyNumber = 'El dorsal debe estar entre 1 y 99.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!initialProfile) return;
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await Promise.all([
        PlayerService.updatePosition(initialProfile.id, values.position),
        PlayerService.updateJerseyNumber(initialProfile.id, Number(values.jerseyNumber)),
      ]);
      setSuccess('Perfil deportivo actualizado correctamente.');
      onSaved?.();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.kind === 'NETWORK' ? `Error de red: ${e.message}` : e.message);
      } else {
        setError(e instanceof Error ? e.message : 'No se pudo guardar el perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (photo: File) => {
    if (!initialProfile) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await PlayerService.updatePhoto(initialProfile.id, photo);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const dataUrl = typeof fileReader.result === 'string' ? fileReader.result : null;
        if (!dataUrl) return;
        saveStoredProfilePhoto(initialProfile.id, dataUrl);
        setPhotoPreview(dataUrl);
      };
      fileReader.readAsDataURL(photo);
      setSuccess('Foto de perfil actualizada correctamente.');
      onSaved?.();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.kind === 'NETWORK' ? `Error de red: ${e.message}` : e.message);
      } else {
        setError(e instanceof Error ? e.message : 'No se pudo actualizar la foto de perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, loading, error, success, photoPreview, setField, save, updatePhoto };
}
