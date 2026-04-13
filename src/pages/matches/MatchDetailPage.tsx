import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import MatchService from '../../services/match.service';
import TeamService from '../../services/team.service';
import type { Match, MatchEvent, Team } from '../../types';

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const matchId = parseInt(id ?? '0');
  const isOrganizer =
    user?.role === 'ORGANIZER' || user?.role === 'ORGANIZADOR' || user?.role === 'ADMIN';

  const { data: match, loading, error } = useFetch<Match>(() => MatchService.getById(matchId), [matchId]);
  const { data: events, refetch: refetchEvents } = useFetch<MatchEvent[]>(() => MatchService.getEvents(matchId), [matchId]);
  const { data: teams } = useFetch<Team[]>(() => TeamService.getAll());

  const [homeGoals, setHomeGoals] = useState('');
  const [awayGoals, setAwayGoals] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const getTeamName = (id?: number) => !id ? '—' : teams?.find((t) => t.id === id)?.name ?? `Equipo ${id}`;

  const handleSaveResult = async () => {
    if (!match) return;
    setSaving(true); setSaveMsg(null);
    try {
      await MatchService.registerResult(match.id, {
        homeGoals: parseInt(homeGoals) || 0,
        awayGoals: parseInt(awayGoals) || 0,
      });
      setSaveMsg('✅ Resultado guardado');
    } catch (e) {
      setSaveMsg(`⚠️ ${e instanceof Error ? e.message : 'Error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={s.center}>Cargando partido...</div>;
  if (error || !match) return (
    <div style={s.center}>
      <p style={{ color: '#ef4444' }}>No se encontró el partido</p>
      <button style={s.backBtn} onClick={() => navigate('/matches')}>← Volver</button>
    </div>
  );

  const matchDate = new Date(match.matchDate);

  return (
    <div style={s.root}>
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/matches')}>← Partidos</button>
        <h1 style={s.title}>Detalle del Partido</h1>
        <span style={{ ...s.statusBadge, backgroundColor: match.status === 'Finalizado' ? '#22c55e' : match.status === 'En curso' ? '#f59e0b' : '#3b82f6' }}>
          {match.status}
        </span>
      </header>

      <main style={s.main}>
        {/* Score card */}
        <div style={s.scoreCard}>
          <div style={s.teamCol}>
            <div style={s.bigBadge}>{getTeamName(match.homeTeamId).slice(0, 2).toUpperCase()}</div>
            <span style={s.teamLabel}>{getTeamName(match.homeTeamId)}</span>
            <span style={s.teamSub}>Local</span>
          </div>
          <div style={s.scoreCol}>
            <div style={s.bigScore}>
              {match.status === 'Finalizado'
                ? `${match.homeGoals ?? 0} - ${match.awayGoals ?? 0}`
                : 'VS'
              }
            </div>
            <p style={s.matchMeta}>
              {matchDate.toLocaleDateString('es-CO', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p style={s.matchMeta}>
              {matchDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </p>
            {match.field && <p style={s.matchMeta}>📍 {match.field}</p>}
          </div>
          <div style={s.teamCol}>
            <div style={{ ...s.bigBadge, backgroundColor: '#3b82f6' }}>{getTeamName(match.awayTeamId).slice(0, 2).toUpperCase()}</div>
            <span style={s.teamLabel}>{getTeamName(match.awayTeamId)}</span>
            <span style={s.teamSub}>Visitante</span>
          </div>
        </div>

        <div style={s.twoCol}>
          {/* Events */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>EVENTOS DEL PARTIDO</h3>
            {(events ?? []).length === 0 ? (
              <p style={s.emptyText}>Sin eventos registrados</p>
            ) : (
              (events ?? []).map((ev) => (
                <div key={ev.id} style={s.eventRow}>
                  <span style={s.eventMinute}>{ev.minute}'</span>
                  <span style={s.eventIcon}>
                    {ev.type === 'GOL' ? '⚽' : ev.type === 'TARJETA_AMARILLA' ? '🟨' : ev.type === 'TARJETA_ROJA' ? '🟥' : '📋'}
                  </span>
                  <span style={s.eventType}>{ev.type.replace('_', ' ')}</span>
                  <span style={s.eventPlayer}>Jugador #{ev.playerId}</span>
                </div>
              ))
            )}
          </div>

          {/* Organizer controls */}
          {isOrganizer && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>REGISTRAR RESULTADO</h3>
              <div style={s.resultRow}>
                <div style={s.resultField}>
                  <label style={s.label}>{getTeamName(match.homeTeamId)}</label>
                  <input
                    style={s.input}
                    type="number"
                    min={0}
                    placeholder="0"
                    value={homeGoals}
                    onChange={(e) => setHomeGoals(e.target.value)}
                  />
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, alignSelf: 'flex-end', paddingBottom: 8 }}>-</span>
                <div style={s.resultField}>
                  <label style={s.label}>{getTeamName(match.awayTeamId)}</label>
                  <input
                    style={s.input}
                    type="number"
                    min={0}
                    placeholder="0"
                    value={awayGoals}
                    onChange={(e) => setAwayGoals(e.target.value)}
                  />
                </div>
              </div>
              {saveMsg && <p style={{ fontSize: 12, color: '#22c55e' }}>{saveMsg}</p>}
              <button style={s.saveBtn} onClick={handleSaveResult} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Resultado'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, fontSize: 14, color: '#888' },
  header: { display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  backBtn: { background: 'none', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#22c55e', fontFamily: 'inherit' },
  title: { fontSize: 20, fontWeight: 800, color: '#111', flex: 1 },
  statusBadge: { color: '#fff', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 700 },
  main: { padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' },
  scoreCard: { backgroundColor: '#fff', borderRadius: 16, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  teamCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 },
  bigBadge: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 },
  teamLabel: { fontSize: 16, fontWeight: 800, color: '#111', textAlign: 'center' },
  teamSub: { fontSize: 11, color: '#aaa' },
  scoreCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 },
  bigScore: { fontSize: 48, fontWeight: 900, color: '#111', fontFamily: "'Bebas Neue','Rajdhani',sans-serif" },
  matchMeta: { fontSize: 12, color: '#888', margin: 0, textAlign: 'center' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 12 },
  cardTitle: { fontSize: 12, fontWeight: 800, color: '#222', letterSpacing: 0.8 },
  emptyText: { fontSize: 12, color: '#bbb', textAlign: 'center', padding: '20px 0' },
  eventRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  eventMinute: { fontSize: 12, fontWeight: 800, color: '#22c55e', width: 28 },
  eventIcon: { fontSize: 16 },
  eventType: { fontSize: 12, fontWeight: 600, flex: 1, color: '#333' },
  eventPlayer: { fontSize: 11, color: '#aaa' },
  resultRow: { display: 'flex', alignItems: 'flex-end', gap: 16 },
  resultField: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  label: { fontSize: 11, fontWeight: 700, color: '#555' },
  input: { backgroundColor: '#f5f5f0', border: '1px solid #e0e0dc', borderRadius: 8, padding: '10px', fontSize: 20, fontWeight: 800, textAlign: 'center', outline: 'none', width: '100%' } as CSSProperties,
  saveBtn: { backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
};