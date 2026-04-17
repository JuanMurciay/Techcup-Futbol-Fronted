import { useMemo } from 'react';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';

interface PortalMatchesPageProps {
  mode: 'player' | 'captain' | 'organizer' | 'admin' | 'referee';
}

function normalizeMode(mode: PortalMatchesPageProps['mode']) {
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

export default function PortalMatchesPage({ mode }: PortalMatchesPageProps) {
  const { loading, error, player, matches, refresh } = usePlayerPortalData();
  const { basePath, roleLabel } = normalizeMode(mode);

  const sortedMatches = useMemo(
    () =>
      [...matches].sort((a, b) => {
        const aDate = new Date(a.matchDate ?? '').getTime();
        const bDate = new Date(b.matchDate ?? '').getTime();
        return aDate - bDate;
      }),
    [matches],
  );

  const twoColumns = [sortedMatches.filter((_, index) => index % 2 === 0), sortedMatches.filter((_, index) => index % 2 === 1)];

  return (
    <PortalShell title="Partidos" roleLabel={roleLabel} basePath={basePath} player={player}>
      {loading ? <StatePanel type="loading" message="Cargando partidos..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}
      {!loading && !error ? (
        <div className="tc-group-grid">
          {twoColumns.map((column, index) => (
            <article className="tc-portal-card" key={`match-column-${index}`}>
              <h2>SIGUIENTES PARTIDOS</h2>
              <h3>GRUPO {index === 0 ? 'A' : 'B'}</h3>
              {column.length === 0 ? (
                <StatePanel type="empty" message="Sin partidos programados." />
              ) : (
                <ul className="tc-upcoming-match-list">
                  {column.map((match) => (
                    <li key={match.id}>
                      <p className="tc-upcoming-teams">
                        {match.homeTeam?.name ?? 'Local'} vs {match.awayTeam?.name ?? 'Visitante'}
                      </p>
                      <p>
                        Hora:{' '}
                        {match.matchDate ? new Date(match.matchDate).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'Por definir'}
                      </p>
                      <p>
                        Día:{' '}
                        {match.matchDate
                          ? new Date(match.matchDate).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Por definir'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </PortalShell>
  );
}
