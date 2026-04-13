import type { CSSProperties } from 'react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { icon: '\u229E', label: 'INICIO', path: '/player/dashboard' },
  { icon: '\u{1F465}', label: 'EQUIPOS', path: '/teams' },
  { icon: '\u{1F4C5}', label: 'PARTIDOS', path: '/matches' },
  { icon: '\u{1F4CA}', label: 'TABLA', path: '/standings' },
];

const LEADERBOARD = [
  { name: 'Luis Diaz', team: 'Debug City', pj: 7, goals: 9, ast: 4 },
  { name: 'Martin Cantor', team: 'Algorith FC', pj: 7, goals: 7, ast: 2 },
  { name: 'Jose Moreno', team: 'Los JavaBurguers', pj: 6, goals: 6, ast: 2 },
];

const UPCOMING = [
  { vs: 'Debug City', when: 'Mar 22 · 10:00 am', where: 'Local', dot: '#22c55e' },
  { vs: 'Algorith FC', when: 'Mar 29 · 2:00 pm', where: 'Visitante', dot: '#f59e0b' },
  { vs: 'Network Rovers', when: 'Abr 5 · 11:00 am', where: 'Local', dot: '#ef4444' },
];

export default function PlayerDashboard() {
  const { user, logout } = useAuth();
  const email = user?.email ?? '';
  const short = email.split('@')[0] ?? 'Jugador';
  const display = short.includes('.') ? short.split('.')[0].replace(/-/g, ' ') : short;
  const titled = display.charAt(0).toUpperCase() + display.slice(1);
  const initials = titled.slice(0, 2).toUpperCase();

  return (
    <DashboardShell
      accent="green"
      navItems={NAV}
      roleLabel="Jugador"
      userName={`${titled.charAt(0)}. ${titled.split(' ').pop() ?? titled}`}
      userInitials={initials}
      onLogout={logout}
    >
      <section style={s.welcome}>
        <h1 style={s.h1}>{'\u00A1'}Bienvenido de vuelta {titled}!</h1>
        <p style={s.sub}>Los JavaBurguers · Jornada 4 de 8</p>
      </section>

      <div style={s.statsRow}>
        <StatCard icon={'\u26BD'} value="4" label="Mis goles" />
        <StatCard icon={'\u{1F4C8}'} value="2" label="Mis asistencias" />
        <StatCard icon={'\u{1F7E1}'} value="2" label="Mis tarjetas" />
        <StatCard icon={'\u{1F3DF}\uFE0F'} value="7" label="Partidos jugados" />
      </div>

      <div style={s.twoCol}>
        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Mejores del torneo</span>
            <button type="button" style={s.dots}>
              {'\u22EF'}
            </button>
          </div>
          <div style={s.illus}>{'\u{1F3C3}'}</div>
          <p style={s.rankLine}>
            <strong>Mi posición: 5°</strong>
            <span style={s.up}> subió 1 posición {'\u2191'}</span>
          </p>
          <table style={s.table}>
            <tbody>
              {LEADERBOARD.map((row, i) => (
                <tr key={row.name}>
                  <td style={s.tdRank}>{i + 1}</td>
                  <td style={s.tdName}>
                    <div style={s.tdMain}>{row.name}</div>
                    <div style={s.tdSub}>{row.team}</div>
                  </td>
                  <td style={s.tdPills}>
                    <span style={s.pill}>{row.pj} PJ</span>
                    <span style={s.pill}>{row.goals} Goles</span>
                    <span style={s.pill}>{row.ast} Asist.</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Próximos partidos</span>
            <button type="button" style={s.dots}>
              {'\u22EF'}
            </button>
          </div>
          <div style={s.field}>{'\u26BD'}</div>
          <p style={s.teamCtx}>Equipo: Los JavaBurgers</p>
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

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={s.statCard}>
      <span style={s.statIcon}>{icon}</span>
      <div>
        <div style={s.statVal}>{value}</div>
        <div style={s.statLbl}>{label}</div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  welcome: { marginBottom: 8 },
  h1: { fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 6px' },
  sub: { fontSize: 14, color: '#666', margin: 0 },
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
  statIcon: { fontSize: 28 },
  statVal: { fontSize: 22, fontWeight: 900, color: '#111' },
  statLbl: { fontSize: 11, color: '#888', fontWeight: 600 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: 800, color: '#222' },
  dots: { border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#999' },
  illus: { fontSize: 64, textAlign: 'center', margin: '8px 0' },
  rankLine: { fontSize: 13, color: '#333', margin: '0 0 16px' },
  up: { color: '#22c55e', fontWeight: 700 },
  table: { width: '100%', borderCollapse: 'collapse' },
  tdRank: { verticalAlign: 'top', fontWeight: 800, color: '#22c55e', width: 28, fontSize: 14 },
  tdName: { paddingBottom: 12 },
  tdMain: { fontWeight: 700, fontSize: 13 },
  tdSub: { fontSize: 11, color: '#999' },
  tdPills: { textAlign: 'right', verticalAlign: 'top' },
  pill: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: 20,
    padding: '4px 10px',
    fontSize: 10,
    fontWeight: 700,
    marginLeft: 4,
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
  teamCtx: { fontSize: 13, fontWeight: 700, margin: '0 0 12px' },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  matchRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  matchVs: { fontWeight: 700, fontSize: 14 },
  matchMeta: { fontSize: 12, color: '#888' },
};
