import apiClient from './apiClient';
import type { Team, ProfileDTO } from '../types';

const TeamService = {
  getAll: async () => {
    const res = await apiClient.get<Team[]>('/api/v1/teams');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<Team>(`/api/v1/teams/${id}`);
    return res.data;
  },

  create: async (data: { name: string; colors: string }) => {
    const res = await apiClient.post('/api/v1/teams', data);
    return res.data;
  },

  getPlayers: async (id: number) => {
    const res = await apiClient.get<ProfileDTO[]>(`/api/v1/teams/${id}/players`);
    return res.data;
  },

  sendInvitation: async (teamId: number, playerId: number) => {
    const res = await apiClient.post(`/api/v1/teams/${teamId}/invitations`, { playerId });
    return res.data;
  },

  removePlayer: async (teamId: number, playerId: number) => {
    const res = await apiClient.delete(`/api/v1/teams/${teamId}/players/${playerId}`);
    return res.data;
  },

  updateShield: async (id: number, shieldUrl: string) => {
    const res = await apiClient.patch(`/api/v1/teams/${id}/shield`, { shieldUrl });
    return res.data;
  },
};

export default TeamService;
