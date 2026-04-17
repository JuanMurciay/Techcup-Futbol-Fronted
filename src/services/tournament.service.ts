import type { Tournament, StandingDTO } from '../types';
import type { CreateTournamentRequestDTO } from '../types/api/tournament';
import { httpGet, httpPost } from './http';

const TournamentService = {
  getAll: async () => {
    return httpGet<Tournament[]>('/api/v1/tournaments');
  },

  getById: async (id: number) => {
    return httpGet<Tournament>(`/api/v1/tournaments/${id}`);
  },

  getStandings: async (id: number) => {
    return httpGet<StandingDTO[]>(`/api/v1/tournaments/${id}/standings`);
  },

  create: async (data: CreateTournamentRequestDTO) => {
    return httpPost<unknown, CreateTournamentRequestDTO>('/api/v1/tournaments', data);
  },

  start: async (id: number) => {
    return httpPost<unknown>(`/api/v1/tournaments/${id}/start`);
  },

  generateMatches: async (id: number) => {
    return httpPost<unknown>(`/api/v1/tournaments/${id}/generate-matches`);
  },
};

export default TournamentService;
