import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainConfirmModal from '../../components/portal/CaptainConfirmModal';
import KpiCard from '../../components/portal/KpiCard';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';

interface PortalDashboardPageProps {
  mode: 'player' | 'captain';
}

export default function PortalDashboardPage({ mode }: PortalDashboardPageProps) {
  const { loading, error, player, kpis, matches, refresh } = usePlayerPortalData();
  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const navigate = useNavigate();

  const nextMatch = useMemo(
    () =>
      matches.find(
        (match) =>
          match.status?.toLowerCase().includes('program') || match.status?.toLowerCase().includes('curso'),
      ),
    [matches],
  );

  const lastMatch = useMemo(
    () => [...matches].reverse().find((match) => match.homeGoals != null && match.awayGoals != null),
    [matches],
  );

  const basePath = mode === 'captain' ? '/captain' : '/player';
  const roleLabel = mode === 'captain' ? 'CAPITÁN' : 'JUGADOR';

  const confirmCaptain = () => {
    const raw = localStorage.getItem('tc_user');
    if (raw) {
      const user = JSON.parse(raw) as { email: string; token: string; role: string };
      localStorage.setItem('tc_user', JSON.stringify({ ...user, role: 'CAPTAIN' }));
    }
    navigate('/captain/create-team');
  };

  return (
    <PortalShell title="¡Bienvenido!" roleLabel={roleLabel} basePath={basePath} player={player}>
      {loading ? <StatePanel type="loading" message="Cargando datos del jugador..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}

      {!loading && !error && kpis ? (
        <>
          <div className="tc-kpi-grid" id="stats">
            <KpiCard label="GOLES" value={kpis.goals} />
            <KpiCard label="TARJETAS AMARILLAS" value={kpis.yellowCards} accent="warning" />
            <KpiCard label="PARTIDOS JUGADOS" value={kpis.matchesPlayed} />
            <KpiCard label="ASISTENCIAS" value={kpis.assists} accent="success" />
          </div>

          <div className="tc-dashboard-grid" id="matches">
            <article className="tc-portal-card">
              <h2>PRÓXIMOS PARTIDOS</h2>
              {nextMatch ? (
                <p>
                  {nextMatch.homeTeam?.name ?? 'Equipo Local'} vs {nextMatch.awayTeam?.name ?? 'Equipo Visitante'}
                </p>
              ) : (
                <StatePanel type="empty" message="No hay partidos próximos." />
              )}
              <h3>ÚLTIMO PARTIDO JUGADO</h3>
              {lastMatch ? (
                <p>
                  {lastMatch.homeTeam?.name ?? 'Local'} {lastMatch.homeGoals} - {lastMatch.awayGoals}{' '}
                  {lastMatch.awayTeam?.name ?? 'Visitante'}
                </p>
              ) : (
                <StatePanel type="empty" message="Aún no hay resultados cargados." />
              )}
            </article>

            <article className="tc-portal-card">
              <h2>FASE DE GRUPOS</h2>
              {matches.length === 0 ? (
                <StatePanel type="empty" message="No hay datos de grupos disponibles." />
              ) : (
                <ul className="tc-team-list">
                  {matches.slice(0, 5).map((match) => (
                    <li key={match.id}>
                      {(match.homeTeam?.name ?? 'Local').toUpperCase()} vs{' '}
                      {(match.awayTeam?.name ?? 'Visitante').toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          {mode === 'player' ? (
            <button className="tc-link-action" type="button" onClick={() => setShowCaptainModal(true)}>
              ¿Deseas convertirte en capitán?
            </button>
          ) : null}
        </>
      ) : null}

      <CaptainConfirmModal
        open={showCaptainModal}
        title="¿Estás seguro de que te vas a convertir en capitán?"
        onCancel={() => setShowCaptainModal(false)}
        onConfirm={confirmCaptain}
      />
    </PortalShell>
  );
}
