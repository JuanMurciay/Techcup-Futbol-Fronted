import { useCallback, useEffect, useMemo, useState } from 'react';
import PlayerPortalService from '../services/playerPortal.service';
import TeamService from '../services/team.service';
import type { DashboardKPIs, MatchSummary, ProfileDTO, StandingDTO, Tournament } from '../types';

interface PortalDataState {
  loading: boolean;
  error: string | null;
  player: ProfileDTO | null;
  kpis: DashboardKPIs | null;
  teamStanding: StandingDTO | null;
  teamPlayers: ProfileDTO[];
  tournaments: Tournament[];
  matches: MatchSummary[];
  paymentStatus: string | null;
}

const initialState: PortalDataState = {
  loading: true,
  error: null,
  player: null,
  kpis: null,
  teamStanding: null,
  teamPlayers: [],
  tournaments: [],
  matches: [],
  paymentStatus: null,
};

export function usePlayerPortalData() {
  const [state, setState] = useState<PortalDataState>(initialState);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const authUser = useMemo(() => {
    const raw = localStorage.getItem('tc_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { email: string };
    } catch {
      return null;
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshFlag((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!authUser?.email) {
        setState((prev) => ({ ...prev, loading: false, error: 'No hay sesión activa.' }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const player = await PlayerPortalService.getCurrentPlayerByEmail(authUser.email);
        if (!player) throw new Error('No se encontró el perfil del jugador para la sesión actual.');

        const [kpis, teamStanding, tournaments, matches, paymentStatus] = await Promise.all([
          PlayerPortalService.getPlayerKpis(player.id),
          PlayerPortalService.getPlayerTeamStanding(player.teamId),
          PlayerPortalService.getAllTournaments(),
          PlayerPortalService.getAllMatches(),
          PlayerPortalService.getTeamPaymentStatus(player.teamId),
        ]);

        let teamPlayers: ProfileDTO[] = [];
        if (player.teamId) {
          try {
            teamPlayers = await TeamService.getPlayers(player.teamId);
          } catch {
            teamPlayers = [];
          }
        }

        if (!mounted) return;
        setState({
          loading: false,
          error: null,
          player,
          kpis,
          teamStanding,
          teamPlayers,
          tournaments,
          matches,
          paymentStatus,
        });
      } catch (error) {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error cargando el portal.',
        }));
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [authUser?.email, refreshFlag]);

  return { ...state, refresh };
}
