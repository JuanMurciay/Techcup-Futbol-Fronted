import type { Team, ProfileDTO } from '../types';
import { httpDelete, httpGet, httpPatch, httpPost } from './http';
import type { TeamCreateRequestDTO, TeamInvitationRequestDTO, UpdateTeamShieldRequestDTO } from '../types/api/team';

const TeamService = {
  getAll: async () => {
    return httpGet<Team[]>('/api/v1/teams');
  },

  getById: async (id: number) => {
    return httpGet<Team>(`/api/v1/teams/${id}`);
  },

  create: async (data: TeamCreateRequestDTO) => {
    return httpPost<unknown, TeamCreateRequestDTO>('/api/v1/teams', data);
  },

  getPlayers: async (id: number) => {
    return httpGet<ProfileDTO[]>(`/api/v1/teams/${id}/players`);
  },

  sendInvitation: async (teamId: number, playerId: number) => {
    return httpPost<unknown, TeamInvitationRequestDTO>(`/api/v1/teams/${teamId}/invitations`, { playerId });
  },

  removePlayer: async (teamId: number, playerId: number) => {
    return httpDelete<unknown>(`/api/v1/teams/${teamId}/players/${playerId}`);
  },

  updateShield: async (id: number, shieldUrl: string) => {
    return httpPatch<unknown, UpdateTeamShieldRequestDTO>(`/api/v1/teams/${id}/shield`, { shieldUrl });
  },
};

export default TeamService;
