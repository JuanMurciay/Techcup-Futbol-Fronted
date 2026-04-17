import type { StandingDTO } from '../types';
import { httpGet } from './http';

export interface PlayerStats {
  playerId: number;
  playerName: string;
  matchesPlayed?: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  teamId?: number;
  teamName?: string;
}

const StatsService = {
  getTopScorers: async () => {
    return httpGet<PlayerStats[]>('/api/v1/stats/top-scorers');
  },

  getTopScorersByTournament: async (tournamentId: number) => {
    return httpGet<PlayerStats[]>(
      `/api/v1/stats/tournaments/${tournamentId}/top-scorers`,
    );
  },

  getPlayerStats: async (id: number) => {
    return httpGet<PlayerStats>(`/api/v1/stats/players/${id}`);
  },

  getTeamStats: async (id: number) => {
    return httpGet<StandingDTO>(`/api/v1/stats/teams/${id}`);
  },
};

export default StatsService;
