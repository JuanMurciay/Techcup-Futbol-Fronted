import type { CSSProperties, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLogo } from '../../components/AppLogo';
import { useFetch } from '../../hooks/useFetch';
import PlayerService from '../../services/player.service';
import StatsService from '../../services/stats.service';
import type { ProfileDTO, PlayerStats } from '../../types';

const POSITION_ICON: Record<string, string> = {
  Portero: '🧤', Defensa: '🛡️', Volante: '⚙️', Delantero: '⚡',
};

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playerId = parseInt(id ?? '0');

  const { data: player, loading, error } = useFetch<ProfileDTO>(
    () => PlayerService.getById(playerId), [playerId]
  );
  const { data: stats } = useFetch<PlayerStats>(
    () => StatsService.getPlayerStats(playerId), [playerId]
  );

  if (loading) return <div style={s.center}>Cargando perfil...</div>;
  if (error || !player) return (
    <div style={s.center}>
      <p style={{ color: '#ef4444' }}>Jugador no encontrado</p>
      <button style={s.backBtn} onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );

  const initials = player.fullName?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() ?? 'NA';
  const posIcon = POSITION_ICON[player.position ?? ''] ?? '⚽';

  return (
    <div style={s.root}>
      <header style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>←</button>
        <div style={s.logoCorner}>
          <AppLogo height={56} />
        </div>
      </header>

      <main style={s.main}>
        {/* Hero */}
        <div style={s.heroCard}>
          <div style={s.avatarBig}>
            {player.profilePhoto
              ? <img src={player.profilePhoto} alt={player.fullName} style={s.avatarImg} />
              : <span style={s.avatarText}>{initials}</span>
            }
          </div>
          <div style={s.heroInfo}>
            <div style={s.nameRow}>
              <h1 style={s.playerName}>{player.fullName}</h1>
              {player.jerseyNumber && <span style={s.jerseyBig}>#{player.jerseyNumber}</span>}
            </div>
            <div style={s.badgeRow}>
              <span style={s.roleBadge}>{player.userType}</span>
              {player.position && (
                <span style={s.positionBadge}>{posIcon} {player.position}</span>
              )}
            </div>
            <p style={s.email}>{player.email}</p>
          </div>
        </div>

        {/* Stats cards */}
        {stats && (
          <div style={s.statsRow}>
            <StatCard icon="⚽" label="GOLES" value={stats.goals} color="#22c55e" />
            <StatCard icon="🟨" label="AMARILLAS" value={stats.yellowCards} color="#f59e0b" />
            <StatCard icon="🟥" label="ROJAS" value={stats.redCards} color="#ef4444" />
          </div>
        )}

        {/* Info grid */}
        <div style={s.infoGrid}>
          <InfoCard title="INFORMACIÓN PERSONAL">
            <InfoRow label="Identificación" value={player.identification ?? '—'} />
            <InfoRow label="Fecha de nacimiento" value={player.birthDate ?? '—'} />
            <InfoRow label="Género" value={player.gender ?? '—'} />
          </InfoCard>

          <InfoCard title="INFORMACIÓN DEPORTIVA">
            <InfoRow label="Posición" value={player.position ?? '—'} />
            <InfoRow label="Dorsal" value={player.jerseyNumber ? `#${player.jerseyNumber}` : '—'} />
            <InfoRow label="Equipo" value={player.teamId ? `Equipo #${player.teamId}` : 'Sin equipo'} />
          </InfoCard>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div style={{ ...s.statCard, borderTop: `4px solid ${color}` }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ fontSize: 36, fontWeight: 900, color, fontFamily: "'Bebas Neue','Rajdhani',sans-serif" }}>{value}</span>
      <span style={{ fontSize: 10, fontWeight: 800, color: '#aaa', letterSpacing: 1 }}>{label}</span>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontSize: 12, fontWeight: 800, color: '#333', letterSpacing: 0.8, marginBottom: 16 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f5', paddingBottom: 10 }}>
      <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{value}</span>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, fontSize: 14, color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  backBtn: { background: 'none', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#22c55e', fontFamily: 'inherit' },
  logoCorner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  main: { maxWidth: 800, margin: '0 auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 },
  heroCard: { backgroundColor: '#fff', borderRadius: 16, padding: '28px', display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  avatarBig: { width: 100, height: 100, borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarText: { fontSize: 36, fontWeight: 800, color: '#fff' },
  heroInfo: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 16 },
  playerName: { fontSize: 28, fontWeight: 900, color: '#111', fontFamily: "'Bebas Neue','Rajdhani',sans-serif", margin: 0 },
  jerseyBig: { fontSize: 24, fontWeight: 900, color: '#22c55e' },
  badgeRow: { display: 'flex', gap: 10 },
  roleBadge: { backgroundColor: '#dcfce7', color: '#166534', borderRadius: 8, padding: '4px 14px', fontSize: 12, fontWeight: 700 },
  positionBadge: { backgroundColor: '#f0f0ec', borderRadius: 8, padding: '4px 14px', fontSize: 12, fontWeight: 700 },
  email: { fontSize: 13, color: '#888', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
};