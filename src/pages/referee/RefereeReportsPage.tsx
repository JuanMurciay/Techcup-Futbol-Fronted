import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { icon: '\u229E', label: 'INICIO', path: '/referee/dashboard' },
  { icon: '\u{1F4C5}', label: 'PARTIDOS', path: '/matches' },
  { icon: '\u{1F4CB}', label: 'REPORTES', path: '/referee/reports' },
];

const EVENTS = [
  { min: "12'", icon: '\u26BD', line1: 'Jose M. - Gol', line2: 'Los JavaBurguers - Delantero #9' },
  { min: "50'", icon: '\u{1F7E1}', line1: 'Kevin L. - Tarjeta amarilla', line2: 'Debug City - Defensa #3' },
];

export default function RefereeReportsPage() {
  const { user, logout } = useAuth();
  const email = user?.email ?? '';
  const short = email.split('@')[0] ?? 'arbitro';
  const initials = short.slice(0, 2).toUpperCase() || 'AR';
  const displayName = 'Arbitro Ramires';

  return (
    <DashboardShell
      accent="green"
      navItems={NAV}
      roleLabel="Árbitro"
      userName={displayName}
      userInitials={initials}
      onLogout={logout}
    >
      <h1 style={s.pageTitle}>Reporte en curso</h1>

      <div style={s.scoreboard}>
        <div style={s.teamBlock}>
          <div style={s.teamBadge}>JB</div>
          <span style={s.teamName}>Los JavaBurguers</span>
        </div>
        <div style={s.score}>1 - 0</div>
        <div style={s.teamBlock}>
          <div style={{ ...s.teamBadge, backgroundColor: '#1e293b' }}>DC</div>
          <span style={s.teamName}>Debug City</span>
        </div>
        <div style={s.minPill}>Min 67&apos;</div>
      </div>

      <div style={s.twoCol}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Eventos del partido</h2>
          <ul style={s.evList}>
            {EVENTS.map((e) => (
              <li key={e.min} style={s.evRow}>
                <span style={s.evMin}>{e.min}</span>
                <span style={s.evIcon}>{e.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={s.evLine1}>{e.line1}</div>
                  <div style={s.evLine2}>{e.line2}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Observaciones</h2>
          <p style={s.obsText}>
            Incidente en min 67 por entrada fuerte de K. López sobre jugador rival. Se advirtió a ambos capitanes
            sobre lenguaje inapropiado por parte de los jugadores hacia los arbitros.
          </p>
          <h3 style={s.subTitle}>Asistentes de arbitro del partido</h3>
          <div style={s.asRow}>
            <span style={s.asAv}>MA</span>
            <div>
              <div style={s.asName}>Miguel A.</div>
              <div style={s.asRole}>Linea izquierda</div>
            </div>
          </div>
          <div style={s.asRow}>
            <span style={s.asAv}>CP</span>
            <div>
              <div style={s.asName}>Carlos P.</div>
              <div style={s.asRole}>Linea derecha</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.footerBtns}>
        <Link to="/referee/dashboard" style={s.btnGhost}>
          Ver historial de reportes
        </Link>
        <button type="button" style={s.btnPrimary}>
          Cerrar y firmar reporte del partido
        </button>
      </div>
    </DashboardShell>
  );
}

const s: Record<string, CSSProperties> = {
  pageTitle: { fontSize: 22, fontWeight: 900, color: '#111', margin: '0 0 20px' },
  scoreboard: {
    position: 'relative',
    backgroundColor: '#22c55e',
    borderRadius: 20,
    padding: '32px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  teamBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, minWidth: 120 },
  teamBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    color: '#15803d',
  },
  teamName: { color: '#fff', fontWeight: 800, fontSize: 14, textAlign: 'center' },
  score: { fontSize: 48, fontWeight: 900, color: '#111', fontFamily: "'Bebas Neue','Rajdhani',sans-serif" },
  minPill: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 800,
    color: '#15803d',
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #eee',
  },
  cardTitle: { fontSize: 14, fontWeight: 800, margin: '0 0 16px', color: '#222' },
  evList: { listStyle: 'none', margin: 0, padding: 0 },
  evRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  evMin: { fontWeight: 800, color: '#22c55e', width: 36 },
  evIcon: { fontSize: 20 },
  evLine1: { fontWeight: 700, fontSize: 13 },
  evLine2: { fontSize: 11, color: '#888' },
  obsText: { fontSize: 13, lineHeight: 1.5, color: '#444', margin: '0 0 20px' },
  subTitle: { fontSize: 12, fontWeight: 800, color: '#333', margin: '0 0 12px' },
  asRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  asAv: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 800,
  },
  asName: { fontWeight: 700, fontSize: 13 },
  asRole: { fontSize: 11, color: '#888' },
  footerBtns: { display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  btnGhost: {
    border: '2px solid #f472b6',
    color: '#db2777',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '14px 24px',
    fontWeight: 700,
    fontSize: 14,
    textDecoration: 'none',
    fontFamily: 'inherit',
  },
  btnPrimary: {
    border: 'none',
    backgroundColor: '#22c55e',
    color: '#fff',
    borderRadius: 10,
    padding: '14px 28px',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
