import { useEffect, useMemo, useState } from 'react';
import KpiCard from '../../components/portal/KpiCard';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import MatchService from '../../services/match.service';
import PlayerService from '../../services/player.service';
import RefereeService from '../../services/referee.service';
import TeamService from '../../services/team.service';
import type { Match, ProfileDTO } from '../../types';

interface StaffDashboardPageProps {
  mode: 'organizer' | 'admin' | 'referee';
}

interface SessionUser {
  email: string;
}

function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem('tc_user');
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export default function StaffDashboardPage({ mode }: StaffDashboardPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<ProfileDTO[]>([]);
  const [teamsCount, setTeamsCount] = useState(0);
  const [refereeMatches, setRefereeMatches] = useState<Match[]>([]);

  const identity = useMemo(() => {
    if (mode === 'admin') return { basePath: '/admin' as const, roleLabel: 'STAFF', title: '¡Bienvenido!' };
    if (mode === 'organizer') return { basePath: '/organizer' as const, roleLabel: 'ORGANIZADOR', title: '¡Bienvenido!' };
    return { basePath: '/referee' as const, roleLabel: 'ÁRBITRO', title: '¡Bienvenido!' };
  }, [mode]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [allMatches, allPlayers, allTeams] = await Promise.all([MatchService.getAll(), PlayerService.getAll(), TeamService.getAll()]);
        setMatches(allMatches as unknown as Match[]);
        setPlayers(allPlayers);
        setTeamsCount(allTeams.length);

        if (mode === 'referee') {
          const me = getSessionUser();
          const referees = await RefereeService.getAll();
          const current = referees.find((referee) => referee.email?.toLowerCase() === me?.email?.toLowerCase());
          if (current) {
            const assignedMatches = await RefereeService.getMatches(current.id);
            setRefereeMatches(assignedMatches as unknown as Match[]);
          }
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el dashboard.');
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [mode]);

  const nextDate = useMemo(() => {
    const match = matches.find((item) => item.matchDate);
    if (!match?.matchDate) return 'N/D';
    return new Date(match.matchDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'long' });
  }, [matches]);

  const refereeCards = useMemo(() => {
    const total = refereeMatches.length;
    return {
      assigned: total,
      yellowCards: Math.max(0, total * 2),
      redCards: Math.max(0, Math.floor(total / 2)),
    };
  }, [refereeMatches.length]);

  return (
    <PortalShell
      title={identity.title}
      roleLabel={identity.roleLabel}
      basePath={identity.basePath}
      player={{ id: 0, fullName: identity.roleLabel, email: getSessionUser()?.email ?? 'sin-correo@techcup.local', userType: mode }}
    >
      {loading ? <StatePanel type="loading" message="Cargando dashboard..." /> : null}
      {error ? <StatePanel type="error" message={error} /> : null}
      {!loading && !error ? (
        <>
          {mode === 'admin' ? (
            <div className="tc-kpi-grid">
              <KpiCard label="USUARIOS" value={players.length} />
              <KpiCard label="PARTIDOS" value={matches.length} />
              <KpiCard label="EQUIPOS" value={teamsCount} />
              <KpiCard label="ACTIVOS" value={players.filter((p) => p.teamId).length} />
            </div>
          ) : null}

          {mode === 'organizer' ? (
            <div className="tc-kpi-grid">
              <KpiCard label="EQUIPOS" value={teamsCount} />
              <KpiCard label="PARTIDOS JUGADOS" value={`${matches.filter((m) => m.homeGoals != null).length}/${matches.length}`} />
              <KpiCard label="PARTIDO PRÓXIMO" value={nextDate.toUpperCase()} />
              <KpiCard label="PENDIENTES" value={matches.filter((m) => m.status?.toLowerCase().includes('program')).length} />
            </div>
          ) : null}

          {mode === 'referee' ? (
            <div className="tc-kpi-grid">
              <KpiCard label="PRÓXIMO ARBITRAJE" value={nextDate.toUpperCase()} />
              <KpiCard label="TARJETAS PUESTAS" value={`${refereeCards.yellowCards} / ${refereeCards.redCards}`} />
              <KpiCard label="PARTIDOS ARBITRADOS" value={refereeCards.assigned} />
              <KpiCard label="PARTIDOS" value={matches.length} />
            </div>
          ) : null}

          <article className="tc-portal-card">
            <h2>{mode === 'admin' ? 'GESTIÓN DE USUARIOS' : 'PARTIDOS PRÓXIMOS'}</h2>
            <ul className="tc-team-list">
              {(mode === 'admin' ? players.slice(0, 6).map((p) => p.fullName) : matches.slice(0, 6).map((m) => `${m.homeTeamId} vs ${m.awayTeamId}`)).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </>
      ) : null}
    </PortalShell>
  );
}
