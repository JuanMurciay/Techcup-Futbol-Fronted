import MatchService from './match.service';
import PaymentService from './payment.service';
import PlayerService from './player.service';
import StatsService from './stats.service';
import TeamService from './team.service';
import TournamentService from './tournament.service';
import type { DashboardKPIs, MatchSummary, ProfileDTO, StandingDTO, Team, Tournament } from '../types';

function safeName(fullName: string | undefined): string {
  if (!fullName) return 'Jugador';
  return fullName.trim().split(' ').slice(0, 2).join(' ');
}

const PlayerPortalService = {
  getCurrentPlayerByEmail: async (email: string): Promise<ProfileDTO | null> => {
    const players = await PlayerService.getAll();
    return players.find((player) => player.email?.toLowerCase() === email.toLowerCase()) ?? null;
  },

  getPlayerKpis: async (playerId: number): Promise<DashboardKPIs> => {
    const stats = await StatsService.getPlayerStats(playerId);
    return {
      goals: stats.goals ?? 0,
      yellowCards: stats.yellowCards ?? 0,
      redCards: stats.redCards ?? 0,
      matchesPlayed: stats.matchesPlayed ?? 0,
      assists: 3,
    };
  },

  getPlayerTeam: async (teamId: number | undefined): Promise<Team | null> => {
    if (!teamId) return null;
    return TeamService.getById(teamId);
  },

  getPlayerTeamStanding: async (teamId: number | undefined): Promise<StandingDTO | null> => {
    if (!teamId) return null;
    return StatsService.getTeamStats(teamId);
  },

  getAllTournaments: async (): Promise<Tournament[]> => TournamentService.getAll(),

  getAllMatches: async (): Promise<MatchSummary[]> => {
    const matches = await MatchService.getAll();
    return matches.map((match: any) => ({
      id: match.id,
      status: match.status,
      matchDate: match.matchDate,
      field: match.field,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      homeTeam: match.homeTeam
        ? { id: match.homeTeam.id, name: safeName(match.homeTeam.name), shieldUrl: match.homeTeam.shieldUrl }
        : undefined,
      awayTeam: match.awayTeam
        ? { id: match.awayTeam.id, name: safeName(match.awayTeam.name), shieldUrl: match.awayTeam.shieldUrl }
        : undefined,
    }));
  },

  getTeamPaymentStatus: async (teamId: number | undefined): Promise<string | null> => {
    if (!teamId) return null;
    try {
      const payment = await PaymentService.getByTeam(teamId);
      return payment.status ?? null;
    } catch {
      return null;
    }
  },
};

export default PlayerPortalService;
