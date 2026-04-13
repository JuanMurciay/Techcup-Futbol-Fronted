import apiClient from './apiClient';
import type { ProfileDTO, PlayerRegistrationRequest } from '../types';

const PlayerService = {
  register: async (data: PlayerRegistrationRequest) => {
    const formData = new FormData();
    formData.append('playerData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const res = await apiClient.post('/api/v1/players/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
    const res = await apiClient.patch(`/api/v1/players/${playerId}/invitations/${teamId}`, { action });
    return res.data;
  },
};

export default PlayerService;