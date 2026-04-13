import type { CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import TeamService from '../../services/team.service';
import type { Team, ProfileDTO } from '../../types';

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const teamId = parseInt(id ?? '0');

  const { data: team, loading, error } = useFetch<Team>(() => TeamService.getById(teamId), [teamId]);
  const { data: players } = useFetch<ProfileDTO[]>(() => TeamService.getPlayers(teamId), [teamId]);

  const colors = team?.colors?.split(',') ?? [];
  const isOrganizer = user?.role === 'ORGANIZADOR' || user?.role === 'ADMIN';

  if (loading) return <div style={s.center}>Cargando equipo...</div>;
  if (error || !team) return (
    <div style={s.center}>
      <p style={{ color: '#ef4444' }}>Equipo no encontrado</p>
      <button style={s.backBtn} onClick={() => navigate('/teams')}>← Volver</button>
    </div>
  );

  return (
    <div style={s.root}>
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/teams')}>← Equipos</button>
        <div style={s.logoCorner}>
          <div style={s.logoBox}><span style={{ fontSize: 20 }}>⚽</span></div>
          <span style={s.logoText}>TECHCUP</span>
        </div>
      </header>

      <main style={s.main}>
        {/* Team hero */}
        <div style={s.heroCard}>
          {team.shieldUrl ? (
            <img src={team.shieldUrl} alt={team.name} style={s.shield} />
          ) : (
            <div style={{ ...s.shieldPlaceholder, backgroundColor: colors[0] ?? '#22c55e' }}>
              {team.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div style={s.heroInfo}>
            <h1 style={s.teamName}>{team.name}</h1>
            <div style={s.colorRow}>
              {colors.map((c, i) => (
                <div key={i} style={{ ...s.colorDot, backgroundColor: c }} title={i === 0 ? 'Local' : 'Visitante'} />
              ))}
              {colors[0] && <span style={s.colorLabel}>Local: {colors[0]}</span>}
              {colors[1] && <span style={s.colorLabel}>Visitante: {colors[1]}</span>}
            </div>
            <div style={s.metaRow}>
              <span style={s.metaChip}>👥 {(players ?? []).length} jugadores</span>
              {team.paymentStatus && (
                <span style={{
                  ...s.metaChip,
                  backgroundColor: team.paymentStatus === 'PAGADO' ? '#dcfce7' : '#fef3c7',
                  color: team.paymentStatus === 'PAGADO' ? '#166534' : '#92400e',
                }}>
                  {team.paymentStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Players list */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>JUGADORES</h2>
          {(players ?? []).length === 0 ? (
            <p style={s.emptyText}>Este equipo no tiene jugadores aún</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Jugador</th>
                  <th style={s.th}>Posición</th>
                  <th style={s.th}>Dorsal</th>
                  <th style={s.th}>Rol</th>
                  {isOrganizer && <th style={s.th}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {(players ?? []).map((p) => (
                  <tr key={p.id} style={s.tr}>
                    <td style={s.tdLeft}>
                      <div style={s.playerCell}>
                        <div style={s.playerAvatar}>{p.fullName?.slice(0, 2).toUpperCase() ?? 'NA'}</div>
                        <div>
                          <p style={s.playerName}>{p.fullName}</p>
                          <p style={s.playerEmail}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{p.position ?? '—'}</td>
                    <td style={s.td}>
                      <span style={s.jerseyBadge}>#{p.jerseyNumber ?? '—'}</span>
                    </td>
                    <td style={s.td}>{p.userType}</td>
                    {isOrganizer && (
                      <td style={s.td}>
                        <button
                          style={s.viewBtn}
                          onClick={() => navigate(`/players/${p.id}`)}
                        >
                          Ver perfil
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, fontSize: 14, color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  backBtn: { background: 'none', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#22c55e', fontFamily: 'inherit' },
  logoCorner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  logoBox: { width: 44, height: 44, border: '2px solid #3a6b35', borderRadius: 8, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 8, fontWeight: 800, color: '#3a6b35', letterSpacing: 2 },

  main: { maxWidth: 900, margin: '0 auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 },
  heroCard: { backgroundColor: '#fff', borderRadius: 16, padding: '28px', display: 'flex', alignItems: 'center', gap: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  shield: { width: 100, height: 100, objectFit: 'contain', borderRadius: 12, flexShrink: 0 },
  shieldPlaceholder: { width: 100, height: 100, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 36, fontWeight: 800, flexShrink: 0 },
  heroInfo: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  teamName: { fontSize: 32, fontWeight: 900, color: '#111', fontFamily: "'Bebas Neue','Rajdhani',sans-serif", margin: 0 },
  colorRow: { display: 'flex', alignItems: 'center', gap: 10 },
  colorDot: { width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)' },
  colorLabel: { fontSize: 11, color: '#888' },
  metaRow: { display: 'flex', gap: 10 },
  metaChip: { backgroundColor: '#f0f0ec', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: 13, fontWeight: 800, color: '#222', letterSpacing: 0.8, marginBottom: 16 },
  emptyText: { fontSize: 13, color: '#bbb', textAlign: 'center', padding: '24px 0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '8px 12px', fontSize: 10, fontWeight: 700, color: '#aaa', textAlign: 'center', borderBottom: '1px solid #f0f0f0', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 12px', fontSize: 12, color: '#333', textAlign: 'center' },
  tdLeft: { padding: '12px 12px', fontSize: 12, color: '#333', textAlign: 'left' },
  playerCell: { display: 'flex', alignItems: 'center', gap: 10 },
  playerAvatar: { width: 32, height: 32, borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  playerName: { fontSize: 13, fontWeight: 700, margin: 0, color: '#111' },
  playerEmail: { fontSize: 10, color: '#aaa', margin: 0 },
  jerseyBadge: { backgroundColor: '#f0f0ec', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 800 },
  viewBtn: { backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
};