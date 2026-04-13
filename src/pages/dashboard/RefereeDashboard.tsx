import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { icon: '\u229E', label: 'INICIO', path: '/referee/dashboard' },
  { icon: '\u{1F465}', label: 'EQUIPOS', path: '/teams' },
  { icon: '\u{1F4C5}', label: 'PARTIDOS', path: '/matches' },
  { icon: '\u{1F4CB}', label: 'REPORTES', path: '/referee/reports' },
];

const CARDED = [
  { ini: 'MV', name: 'Manuel V.', team: 'Data Dynamos', role: 'Defensa · #2', kind: 'yellow' as const },
  { ini: 'LR', name: 'Luis R.', team: 'Los JavaBurguer', role: 'Medio Campista · #8', kind: 'yellow' as const },
  { ini: 'MT', name: 'Martin T.', team: 'Data Dynamos', role: 'Delantero · #7', kind: 'red' as const },
];

const UPCOMING = [
  { vs: 'Los JavaBurguers VS Debug City', when: 'Mar 22 · 10:00 am', dot: '#22c55e' },
  { vs: 'Algorithm FC. VS Software Strikers', when: 'Mar 26 · 1:00 pm', dot: '#f59e0b' },
  { vs: 'Los JavaBurguers VS Network Rovers', when: 'Abr 5 · 11:00 am', dot: '#ef4444' },
];

export default function RefereeDashboard() {
  const { user, logout } = useAuth();
  const email = user?.email ?? '';
  const short = email.split('@')[0] ?? 'arbitro';
  const titled = short.replace(/\./g, ' ').replace(/-/g, ' ');
  const parts = titled.split(' ').filter(Boolean);
  const displayName =
    parts.length >= 2
      ? `Arbitro ${parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')}`
      : 'Arbitro Ramires';
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : 'AR';

  return (
    <DashboardShell
      accent="green"
      navItems={NAV}
      roleLabel="Árbitro"
      userName={displayName}
      userInitials={initials}
      onLogout={logout}
    >
      <section style={s.welcome}>
        <h1 style={s.h1}>{'\u00A1'}Bienvenido de vuelta {displayName.replace('Arbitro ', '')}!</h1>
      </section>

      <div style={s.statsRow}>
        <Stat icon={'\u{1F3C3}'} value="7" label="Partidos Arbitrados" />
        <Stat icon={'\u{1F7E1}'} value="4" label="Tarjetas Amarillas" />
        <Stat icon={'\u{1F534}'} value="1" label="Tarjetas Rojas" />
        <Stat icon={'\u{1F4CB}'} value="4" label="Pendientes" />
      </div>

      <div style={s.twoCol}>
        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Último Reporte</span>
            <button type="button" style={s.dots}>
              {'\u22EF'}
            </button>
          </div>
          <div style={s.refIllus}>{'\u{1F6A9}'}</div>
          <p style={s.matchLine}>Partido: Los JavaBurgers 2 - 1 Data Dynamos</p>
          <ul style={s.cardList}>
            {CARDED.map((p) => (
              <li key={p.name} style={s.cardRow}>
                <span style={s.rowIni}>{p.ini}</span>
                <div style={{ flex: 1 }}>
                  <div style={s.rowName}>
                    {p.name} · {p.team}
                  </div>
                  <div style={s.rowSub}>{p.role}</div>
                </div>
                <span style={p.kind === 'red' ? s.redMark : s.yellowMark}>
                  {p.kind === 'red' ? '\u{1F534}' : '\u{1F7E1}'}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/referee/reports" style={s.linkBtn}>
            Ir a reportes
          </Link>
        </div>

        <div style={s.card}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Próximos partidos asignados</span>
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
                  <div style={s.matchVs}>{m.vs}</div>
                  <div style={s.matchMeta}>{m.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
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
  h1: { fontSize: 26, fontWeight: 800, color: '#111', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '18px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  statIcon: { fontSize: 26 },
  statVal: { fontSize: 22, fontWeight: 900, color: '#111' },
  statLbl: { fontSize: 11, color: '#555', fontWeight: 600 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
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
  refIllus: {
    height: 120,
    borderRadius: 12,
    background: 'linear-gradient(180deg, #dbeafe 0%, #93c5fd 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    marginBottom: 12,
  },
  matchLine: { fontSize: 14, fontWeight: 700, margin: '0 0 12px' },
  cardList: { listStyle: 'none', margin: 0, padding: 0 },
  cardRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  rowIni: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 800,
  },
  rowName: { fontSize: 13, fontWeight: 700 },
  rowSub: { fontSize: 11, color: '#888' },
  yellowMark: { fontSize: 20 },
  redMark: { fontSize: 18 },
  linkBtn: {
    display: 'inline-block',
    marginTop: 12,
    fontSize: 12,
    fontWeight: 700,
    color: '#15803d',
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
  matchVs: { fontWeight: 700, fontSize: 13 },
  matchMeta: { fontSize: 12, color: '#888' },
};
