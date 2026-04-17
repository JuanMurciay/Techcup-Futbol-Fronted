import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';

interface PortalTournamentsPageProps {
  mode: 'player' | 'captain';
}

export default function PortalTournamentsPage({ mode }: PortalTournamentsPageProps) {
  const { loading, error, player, tournaments, refresh } = usePlayerPortalData();
  const basePath = mode === 'captain' ? '/captain' : '/player';
  const roleLabel = mode === 'captain' ? 'CAPITÁN' : 'JUGADOR';

  const twoColumns = [tournaments.slice(0, 5), tournaments.slice(5, 10)];

  return (
    <PortalShell title="Torneos" roleLabel={roleLabel} basePath={basePath} player={player}>
      {loading ? <StatePanel type="loading" message="Cargando torneos..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}

      {!loading && !error ? (
        <>
          <h2 className="tc-page-title">TORNEOS</h2>
          {tournaments.length === 0 ? (
            <StatePanel type="empty" message="Aún no hay torneos creados." />
          ) : (
            <div className="tc-group-grid">
              {twoColumns.map((column, index) => (
                <article className="tc-portal-card" key={`group-${index}`}>
                  <h2>FASE DE GRUPOS</h2>
                  <h3>GRUPO {index === 0 ? 'A' : 'B'}</h3>
                  <ul className="tc-team-list">
                    {column.map((tournament) => (
                      <li key={tournament.id}>TORNEO #{tournament.id}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}

          <article className="tc-portal-card">
            <h2>CLASIFICACIÓN FINAL</h2>
            <div className="tc-empty-banner">PRÓXIMAMENTE SALDRÁN LAS CLASIFICACIONES DEL TORNEO</div>
          </article>
        </>
      ) : null}
    </PortalShell>
  );
}
