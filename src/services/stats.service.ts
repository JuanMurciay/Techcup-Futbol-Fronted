import apiClient from './apiClient';
import type { StandingDTO } from '../types';

export interface PlayerStats {
  playerId: number;
  playerName: string;
  goals: number;
  yellowCards: number;
  redCards: number;
  teamId?: number;
  teamName?: string;
}

const StatsService = {
  getTopScorers: async () => {
    const res = await apiClient.get<PlayerStats[]>('/api/v1/stats/top-scorers');
    return res.data;
  },

  getTopScorersByTournament: async (tournamentId: number) => {
    const res = await apiClient.get<PlayerStats[]>(
      `/api/v1/stats/tournaments/${tournamentId}/top-scorers`,
    );
    return res.data;
  },

  getPlayerStats: async (id: number) => {
    const res = await apiClient.get<PlayerStats>(`/api/v1/stats/players/${id}`);
    return res.data;
  },

  getTeamStats: async (id: number) => {
    const res = await apiClient.get<StandingDTO>(`/api/v1/stats/teams/${id}`);
    return res.data;
  },
};

export default StatsService;
