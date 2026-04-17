import { useMemo, useState } from 'react';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';
import TeamService from '../../services/team.service';

interface PortalTeamPageProps {
  mode: 'player' | 'captain';
}

export default function PortalTeamPage({ mode }: PortalTeamPageProps) {
  const { loading, error, player, teamPlayers, teamStanding, paymentStatus, refresh } = usePlayerPortalData();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const selectedPlayer = useMemo(
    () => teamPlayers.find((candidate) => candidate.id === selectedPlayerId) ?? null,
    [selectedPlayerId, teamPlayers],
  );

  const removePlayer = async () => {
    if (!player?.teamId || !selectedPlayer) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await TeamService.removePlayer(player.teamId, selectedPlayer.id);
      setSelectedPlayerId(null);
      refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'No se pudo eliminar al jugador.');
    } finally {
      setActionLoading(false);
    }
  };

  const basePath = mode === 'captain' ? '/captain' : '/player';
  const roleLabel = mode === 'captain' ? 'CAPITÁN' : 'JUGADOR';

  return (
    <PortalShell title="Mi equipo" roleLabel={roleLabel} basePath={basePath} player={player}>
      {loading ? <StatePanel type="loading" message="Cargando plantilla..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}
      {!loading && !error ? (
        <div className="tc-team-layout">
          <div className="tc-kpi-grid">
            <article className="tc-kpi-card">
              <h3>PARTIDOS GANADOS</h3>
              <strong>{teamStanding?.matchesWon ?? 0}</strong>
            </article>
            <article className="tc-kpi-card">
              <h3>PARTIDOS EN EMPATE</h3>
              <strong>{teamStanding?.matchesDrawn ?? 0}</strong>
            </article>
            <article className="tc-kpi-card">
              <h3>PARTIDOS PÉRDIDOS</h3>
              <strong>{teamStanding?.matchesLost ?? 0}</strong>
            </article>
            <article className="tc-kpi-card">
              <h3>TABLA DE POSICIÓN</h3>
              <strong>{teamStanding ? 2 : '-'}</strong>
            </article>
          </div>

          <div className="tc-payment-chip">ESTADO DE PAGO: {paymentStatus?.toUpperCase() ?? 'PENDIENTE'}</div>

          <article className="tc-portal-card">
            <h2>POSICIONAMIENTO DE PARTIDOS</h2>
            {teamPlayers.length === 0 ? (
              <StatePanel type="empty" message="No hay jugadores asociados al equipo." />
            ) : (
              <div className="tc-squad-grid">
                <ul className="tc-squad-list">
                  {teamPlayers.map((item) => (
                    <li key={item.id}>
                      <button type="button" onClick={() => setSelectedPlayerId(item.id)}>
                        {item.fullName}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="tc-field-preview">
                  <p>Cancha (vista previa)</p>
                  <span>{selectedPlayer ? `${selectedPlayer.fullName} seleccionado` : 'Selecciona un jugador'}</span>
                </div>
              </div>
            )}
          </article>

          {mode === 'captain' ? (
            <div className="tc-team-actions">
              <button type="button" className="tc-btn-green">
                EDITAR POSICIÓN
              </button>
              <button type="button" className="tc-btn-red" disabled={!selectedPlayer || actionLoading} onClick={removePlayer}>
                {actionLoading ? 'ELIMINANDO...' : 'ELIMINAR JUGADOR'}
              </button>
            </div>
          ) : null}
          {actionError ? <p className="tc-status-error">{actionError}</p> : null}
        </div>
      ) : null}
    </PortalShell>
  );
}
