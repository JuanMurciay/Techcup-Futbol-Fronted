import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { icon: '\u229E', label: 'INICIO', path: '/captain/dashboard' },
  { icon: '\u{1F465}', label: 'EQUIPOS', path: '/teams' },
  { icon: '\u{1F4C5}', label: 'PARTIDOS', path: '/matches' },
  { icon: '\u{1F4CA}', label: 'TABLA', path: '/standings' },
];

const ROSTER = [
  { ini: 'CP', name: 'Carlos P.', role: 'Portero · #1', goals: 0 },
  { ini: 'LR', name: 'Luis R.', role: 'Medio Campista · #8', goals: 2 },
  { ini: 'JM', name: 'Jose M.', role: 'Delantero · #9', goals: 6 },
];

const UPCOMING = [
  { vs: 'Debug City', when: 'Mar 22 · 10:00 am', where: 'Local', dot: '#22c55e' },
  { vs: 'Algorith FC', when: 'Mar 29 · 2:00 pm', where: 'Visitante', dot: '#f59e0b' },
  { vs: 'Network Rovers', when: 'Abr 5 · 11:00 am', where: 'Local', dot: '#ef4444' },
];

export default function CaptainDashboard() {
  const { user, logout } = useAuth();
  const email = user?.email ?? '';
  const short = email.split('@')[0] ?? 'Capitán';
  const titled = short.charAt(0).toUpperCase() + short.slice(1).split('.')[0];
  const initials = titled.slice(0, 2).toUpperCase();

  return (
    <DashboardShell
      accent="green"
      navItems={NAV}
      roleLabel="Capitán"
      userName={`J. ${titled}`}
      userInitials={initials}
      onLogout={logout}
    >
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/teams/create" style={s.manageLink}>
          Gestionar / crear equipo
        </Link>
      </div>

      <section style={s.welcome}>
        <h1 style={s.h1}>{'\u00A1'}Bienvenido de vuelta {titled}!</h1>
      </section>

      <div style={s.statsRow}>
        <Stat icon={'\u2713'} tone="#22c55e" value="3" label="Ganados" />
        <Stat icon={'\u2795'} tone="#f59e0b" value="2" label="Empates" />
        <Stat icon={'\u2717'} tone="#ef4444" value="2" label="Perdidos" />
        <Stat icon={'\u{1F4CA}'} tone="#3b82f6" value="2°" label="Posición" />
      </div>

      <div style={s.twoCol}>
        <div style={s.card}>
          <div style={s.cardHead}>
            <div>
              <div style={s.cardTitle}>Mi equipo</div>
              <div style={s.captainLine}>Capitán: Juan Sebastian Murcia</div>
            </div>
            <button type="button" style={s.dots}>
              {'\u22EF'}
            </button>
          </div>
          <div style={s.playerArt}>18</div>
          <p style={s.teamName}>Equipo: Los JavaBurgers</p>
          <ul style={s.roster}>
            {ROSTER.map((p) => (
              <li key={p.name} style={s.rosterRow}>
                <div style={s.rosterAv}>{p.ini}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.rosterName}>{p.name}</div>
                  <div style={s.rosterRole}>{p.role}</div>
                </div>
                <span style={s.goalBadge}>{p.goals} goles</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Próximos partidos</span>
            <button type="button" style={s.dots}>
              {'\u22EF'}
            </button>
          </div>
          <div style={s.field}>{'\u26BD'}</div>
          <p style={s.teamName}>Equipo: Los JavaBurgers</p>
          <ul style={s.list}>
            {UPCOMING.map((m) => (
              <li key={m.vs} style={s.matchRow}>
                <span style={{ ...s.dot, backgroundColor: m.dot }} />
                <div style={{ flex: 1 }}>
                  <div style={s.matchVs}>VS {m.vs}</div>
                  <div style={s.matchMeta}>
                    {m.when} · {m.where}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}

function Stat({ icon, value, label, tone }: { icon: string; value: string; label: string; tone: string }) {
  return (
    <div style={s.statCard}>
      <span style={{ ...s.statIcon, color: tone }}>{icon}</span>
      <div>
        <div style={s.statVal}>{value}</div>
        <div style={s.statLbl}>{label}</div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  manageLink: { fontSize: 12, fontWeight: 700, color: '#15803d' },
  welcome: { marginBottom: 8 },
  h1: { fontSize: 26, fontWeight: 800, color: '#111', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '18px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  statIcon: { fontSize: 26, fontWeight: 800 },
  statVal: { fontSize: 22, fontWeight: 900, color: '#111' },
  statLbl: { fontSize: 11, color: '#888', fontWeight: 600 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: 800, color: '#222' },
  captainLine: { fontSize: 11, color: '#888', marginTop: 4 },
  dots: { border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#999' },
  playerArt: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #fecaca 0%, #ef4444 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 900,
    color: '#fff',
    marginBottom: 12,
  },
  teamName: { fontSize: 14, fontWeight: 800, margin: '0 0 16px' },
  roster: { listStyle: 'none', margin: 0, padding: 0 },
  rosterRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  rosterAv: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#e5e5e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
  },
  rosterName: { fontWeight: 700, fontSize: 13 },
  rosterRole: { fontSize: 11, color: '#999' },
  goalBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 800,
  },
  field: {
    height: 100,
    borderRadius: 12,
    background: 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    marginBottom: 12,
  },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  matchRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  matchVs: { fontWeight: 700, fontSize: 14 },
  matchMeta: { fontSize: 12, color: '#888' },
};
