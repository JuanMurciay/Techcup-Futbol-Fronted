import { useEffect, useMemo, useState } from 'react';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';
import TournamentService from '../../services/tournament.service';
import type { StandingDTO } from '../../types';

interface PortalStatsPageProps {
  mode: 'player' | 'captain' | 'organizer' | 'admin' | 'referee';
}

function normalizeMode(mode: PortalStatsPageProps['mode']) {
  switch (mode) {
    case 'captain':
      return { basePath: '/captain' as const, roleLabel: 'CAPITÁN' };
    case 'organizer':
      return { basePath: '/organizer' as const, roleLabel: 'ORGANIZADOR' };
    case 'admin':
      return { basePath: '/admin' as const, roleLabel: 'STAFF' };
    case 'referee':
      return { basePath: '/referee' as const, roleLabel: 'ÁRBITRO' };
    default:
      return { basePath: '/player' as const, roleLabel: 'JUGADOR' };
  }
}

export default function PortalStatsPage({ mode }: PortalStatsPageProps) {
  const { loading, error, player, tournaments, refresh } = usePlayerPortalData();
  const [standings, setStandings] = useState<StandingDTO[]>([]);
  const [standingsError, setStandingsError] = useState<string | null>(null);
  const { basePath, roleLabel } = normalizeMode(mode);

  const primaryTournamentId = useMemo(() => tournaments[0]?.id, [tournaments]);

  useEffect(() => {
    const loadStandings = async () => {
      if (!primaryTournamentId) {
        setStandings([]);
        return;
      }
      try {
        setStandingsError(null);
        const data = await TournamentService.getStandings(primaryTournamentId);
        setStandings(data);
      } catch (loadError) {
        setStandings([]);
        setStandingsError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la tabla de posiciones.');
      }
    };
    void loadStandings();
  }, [primaryTournamentId]);

  return (
    <PortalShell title="Estadísticas" roleLabel={roleLabel} basePath={basePath} player={player}>
      {loading ? <StatePanel type="loading" message="Cargando estadísticas..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}
      {!loading && !error ? (
        <article className="tc-portal-card">
          <h2>TABLA DE POSICIONES</h2>
          {standingsError ? <StatePanel type="error" message={standingsError} /> : null}
          {!standingsError && standings.length === 0 ? <StatePanel type="empty" message="Aún no hay posiciones calculadas." /> : null}
          {!standingsError && standings.length > 0 ? (
            <div className="tc-standings-wrap">
              <table className="tc-standings-table">
                <thead>
                  <tr>
                    <th>POS</th>
                    <th>EQUIPO</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                    <th>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => (
                    <tr key={row.teamId}>
                      <td>{index + 1}</td>
                      <td>{row.teamName}</td>
                      <td>{row.matchesPlayed}</td>
                      <td>{row.matchesWon}</td>
                      <td>{row.matchesDrawn}</td>
                      <td>{row.matchesLost}</td>
                      <td>{row.goalsFor}</td>
                      <td>{row.goalsAgainst}</td>
                      <td>{row.goalDifference}</td>
                      <td>{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>
      ) : null}
    </PortalShell>
  );
}
