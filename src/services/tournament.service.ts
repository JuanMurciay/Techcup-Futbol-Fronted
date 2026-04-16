import apiClient from './apiClient';
import type { Tournament, StandingDTO } from '../types';

const TournamentService = {
  getAll: async () => {
    const res = await apiClient.get<Tournament[]>('/api/v1/tournaments');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<Tournament>(`/api/v1/tournaments/${id}`);
    return res.data;
  },

  getStandings: async (id: number) => {
    const res = await apiClient.get<StandingDTO[]>(`/api/v1/tournaments/${id}/standings`);
    return res.data;
  },

  create: async (data: {
    startDate: string;
    endDate: string;
    teamCost: number;
    numberOfTeams: number;
    rules: string;
  }) => {
    const res = await apiClient.post('/api/v1/tournaments', data);
    return res.data;
  },

  start: async (id: number) => {
    const res = await apiClient.post(`/api/v1/tournaments/${id}/start`);
    return res.data;
  },

  generateMatches: async (id: number) => {
    const res = await apiClient.post(`/api/v1/tournaments/${id}/generate-matches`);
    return res.data;
  },
};

export default TournamentService;
