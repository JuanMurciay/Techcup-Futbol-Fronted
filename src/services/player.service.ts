import type { ProfileDTO, PlayerRegistrationRequest } from '../types';
import { httpGet, httpPatch, httpPost } from './http';
import type {
  InvitationActionRequestDTO,
  PlayerRegistrationApiBodyDTO,
  UpdateAvailabilityRequestDTO,
  UpdateJerseyRequestDTO,
  UpdatePositionRequestDTO,
} from '../types/api/player';
import apiClient from './apiClient';

/** Cuerpo JSON que espera el back (misma forma que Postman). */
const UI_POSITION_TO_API: Record<string, string> = {
  Portero: 'PORTERO',
  Defensa: 'DEFENSA',
  Volante: 'VOLANTE',
  Delantero: 'DELANTERO',
};

const UI_ROLE_TO_API: Record<string, string> = {
  JUGADOR: 'PLAYER',
  CAPITAN: 'CAPTAIN',
  ARBITRO: 'REFEREE',
};

function splitFullName(full: string): { firstName: string; lastName: string } {
  const t = full.trim();
  const i = t.indexOf(' ');
  if (i === -1) return { firstName: t, lastName: t };
  return { firstName: t.slice(0, i), lastName: t.slice(i + 1).trim() };
}

function ageFromBirthDate(isoDate: string): number {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 18;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return Math.max(age, 1);
}

function toRegisterBody(data: PlayerRegistrationRequest): PlayerRegistrationApiBodyDTO {
  const { firstName, lastName } = splitFullName(data.name);
  const userType = UI_ROLE_TO_API[data.userType] ?? data.userType;
  const position =
    UI_POSITION_TO_API[data.position] ?? data.position.toUpperCase().replace(/\s/g, '_');
  const age = data.birthDate ? ageFromBirthDate(data.birthDate) : 18;

  return {
    userType,
    email: data.email.trim(),
    password: data.password,
    firstName,
    lastName,
    identification: data.identification.trim(),
    age,
    position,
    skillLevel: 'INTERMEDIO',
  };
}

const PlayerService = {
  register: async (data: PlayerRegistrationRequest) => {
    const registerBody = toRegisterBody(data);
    if (!data.profilePhoto) {
      return httpPost<unknown, PlayerRegistrationApiBodyDTO>('/api/v1/players/register', registerBody);
    }
    const formData = new FormData();
    formData.append('playerData', new Blob([JSON.stringify(registerBody)], { type: 'application/json' }));
    formData.append('profilePhoto', data.profilePhoto);
    const res = await apiClient.post('/api/v1/players/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getAll: async () => {
    return httpGet<ProfileDTO[]>('/api/v1/players');
  },

  getById: async (id: number) => {
    return httpGet<ProfileDTO>(`/api/v1/players/${id}`);
  },

  getAvailable: async () => {
    return httpGet<ProfileDTO[]>('/api/v1/players/available');
  },

  updatePosition: async (id: number, position: string) => {
    return httpPatch<unknown, UpdatePositionRequestDTO>(`/api/v1/players/${id}/position`, { position });
  },

  updateJerseyNumber: async (id: number, jerseyNumber: number) => {
    return httpPatch<unknown, UpdateJerseyRequestDTO>(`/api/v1/players/${id}/jersey-number`, { jerseyNumber });
  },

  updateAvailability: async (id: number, available: boolean) => {
    return httpPatch<unknown, UpdateAvailabilityRequestDTO>(`/api/v1/players/${id}/availability`, { available });
  },
  processInvitation: async (invitationId: number, action: 'ACCEPT' | 'REJECT') => {
    return httpPatch<unknown, InvitationActionRequestDTO>(`/api/v1/players/invitations/${invitationId}`, { action });
  },

  respondToInvitation: async (playerId: number, teamId: number, action: 'ACCEPT' | 'REJECT') => {
    return httpPatch<unknown, InvitationActionRequestDTO>(`/api/v1/players/${playerId}/invitations/${teamId}`, {
      action,
    });
  },

  updatePhoto: async (id: number, photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);
    const res = await apiClient.patch(`/api/v1/players/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default PlayerService;
