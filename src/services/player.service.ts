import apiClient from './apiClient';
import type { ProfileDTO, PlayerRegistrationRequest } from '../types';

/** Cuerpo JSON que espera el back (misma forma que Postman). */
export interface PlayerRegisterApiBody {
  userType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  identification: string;
  age: number;
  position: string;
  skillLevel: string;
}

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

function toRegisterBody(data: PlayerRegistrationRequest): PlayerRegisterApiBody {
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
    const res = await apiClient.post('/api/v1/players/register', toRegisterBody(data));
    return res.data;
  },

  getAll: async () => {
    const res = await apiClient.get<ProfileDTO[]>('/api/v1/players');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ProfileDTO>(`/api/v1/players/${id}`);
    return res.data;
  },

  getAvailable: async () => {
    const res = await apiClient.get<ProfileDTO[]>('/api/v1/players/available');
    return res.data;
  },

  updatePosition: async (id: number, position: string) => {
    const res = await apiClient.patch(`/api/v1/players/${id}/position`, { position });
    return res.data;
  },

  updateJerseyNumber: async (id: number, jerseyNumber: number) => {
    const res = await apiClient.patch(`/api/v1/players/${id}/jersey-number`, { jerseyNumber });
    return res.data;
  },

  updateAvailability: async (id: number, available: boolean) => {
    const res = await apiClient.patch(`/api/v1/players/${id}/availability`, { available });
    return res.data;
  },
  processInvitation: async (invitationId: number, action: 'ACCEPT' | 'REJECT') => {
    const res = await apiClient.patch(`/api/v1/players/invitations/${invitationId}`, { action });
    return res.data;
  },

  respondToInvitation: async (playerId: number, teamId: number, action: 'ACCEPT' | 'REJECT') => {
    const res = await apiClient.patch(`/api/v1/players/${playerId}/invitations/${teamId}`, {
      action,
    });
    return res.data;
  },
};

export default PlayerService;
