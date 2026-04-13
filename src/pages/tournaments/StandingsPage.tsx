import { useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import TournamentService from '../../services/tournament.service';
import type { Tournament, StandingDTO } from '../../types';
import { homePathFromStoredRole } from '../../utils/roles';
import { AppLogo } from '../../components/AppLogo';

const FORM_COLORS: Record<string, string> = { W: '#22c55e', D: '#f59e0b', L: '#ef4444' };

export default function StandingsPage() {
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] ?? '';
  const home = homePathFromStoredRole(user?.role);
  const nav = useMemo(
    () => [
      { icon: '\u229E', label: 'INICIO', path: home },
      { icon: '\u{1F465}', label: 'EQUIPOS', path: '/teams' },
      { icon: '\u{1F4C5}', label: 'PARTIDOS', path: '/matches' },
      { icon: '\u{1F4CA}', label: 'TABLA', path: '/standings' },
    ],
    [home],
  );

  const { data: tournaments } = useFetch<Tournament[]>(() => TournamentService.getAll());
  const activeTournament = (tournaments ?? []).find((t) =>
    t.status === 'En progreso' || t.status === 'Activo' || t.status === 'Borrador'
  ) ?? (tournaments ?? [])[0];

  const { data: standings, loading } = useFetch<StandingDTO[]>(
    () => activeTournament ? TournamentService.getStandings(activeTournament.id) : Promise.resolve([]),
    [activeTournament?.id],
  );

  const topTeams = (standings ?? []).slice(0, 8);
  const bottomTeams = (standings ?? []).slice(8);

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sidebarLogo}>
            <AppLogo height={44} />
          </div>
          {nav.map(({ icon, label, path }) => (
            <a key={label} href={path} style={{ ...s.navItem, ...(path === '/standings' ? s.navActive : {}) }}>
              <span>{icon}</span>
              <span style={s.navLabel}>{label}</span>
            </a>
          ))}
        </div>
        <div style={s.bottomAvatar}>
          {userName.slice(0, 2).toUpperCase()}
        </div>
      </aside>

      <main style={s.main}>
        <h2 style={s.pageTitle}>Tabla de Posiciones de TechCup</h2>

        {loading && <p style={s.loading}>Cargando tabla...</p>}

        {!loading && (
          <div style={s.layout}>
            <div style={s.tableSection}>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    {['Pos', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'Pts', 'Forma'].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(standings ?? []).length === 0 ? (
                    <tr><td colSpan={11} style={s.emptyCell}>No hay equipos en la tabla aún</td></tr>
                  ) : (
                    (standings ?? []).map((st, i) => (
                      <StandingRow key={st.teamId} standing={st} rank={i + 1} isHighlight={i < 8} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={s.rightCol}>
              <div style={s.highlightCard}>
                <div style={s.highlightImg}>🏃</div>
                <div>
                  <p style={s.highlightLabel}>Mejor Jugador</p>
                  <p style={s.highlightName}>Luis Diaz</p>
                </div>
              </div>
              <div style={s.highlightCard}>
                <div style={s.highlightImg}>🛡️</div>
                <div>
                  <p style={s.highlightLabel}>Mejor Defensa</p>
                  <p style={s.highlightName}>Embebed United</p>
                </div>
              </div>
              <div style={s.highlightCard}>
                <div style={s.highlightImg}>⚽</div>
                <div>
                  <p style={s.highlightLabel}>Mejor Ataque</p>
                  <p style={s.highlightName}>Network Rovers</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StandingRow({ standing: st, rank, isHighlight }: {
  standing: StandingDTO;
  rank: number;
  isHighlight: boolean;
}) {
  const initials = st.teamName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const isTop = rank === 1;
  const form = isTop ? ['W', 'W', 'W'] : rank <= 3 ? ['W', 'D', 'W'] : rank <= 6 ? ['D', 'W', 'L'] : ['L', 'L', 'W'];

  return (
    <tr style={{ ...s.tr, ...(isTop ? s.trHighlight : {}) }}>
      <td style={{ ...s.td, fontWeight: 800, color: isTop ? '#22c55e' : '#333' }}>{rank}</td>
      <td style={{ ...s.td, textAlign: 'left' }}>
        <div style={s.teamCell}>
          <div style={{ ...s.teamBadge, backgroundColor: BADGE_COLORS[rank % BADGE_COLORS.length] }}>
            {initials}
          </div>
          <div>
            <p style={s.teamName}>{st.teamName}</p>
            <p style={s.captainName}>—</p>
          </div>
        </div>
      </td>
      <td style={s.td}>{st.matchesPlayed}</td>
      <td style={s.td}>{st.matchesWon}</td>
      <td style={s.td}>{st.matchesDrawn}</td>
      <td style={s.td}>{st.matchesLost}</td>
      <td style={s.td}>{st.goalsFor}</td>
      <td style={s.td}>{st.goalsAgainst}</td>
      <td style={{ ...s.td, color: st.goalDifference > 0 ? '#22c55e' : st.goalDifference < 0 ? '#ef4444' : '#888', fontWeight: 700 }}>
        {st.goalDifference > 0 ? '+' : ''}{st.goalDifference}
      </td>
      <td style={{ ...s.td, fontWeight: 800, color: '#111' }}>{st.points}</td>
      <td style={s.td}>
        <div style={s.formRow}>
          {form.map((r, i) => (
            <div key={i} style={{ ...s.formDot, backgroundColor: FORM_COLORS[r] }}>
              {r}
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

const BADGE_COLORS = ['#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#22c55e', '#6366f1', '#14b8a6', '#f97316'];

const NAV = [
  { icon: '⊞', label: 'INICIO', path: '/dashboard' },
  { icon: '👥', label: 'EQUIPOS', path: '/teams' },
  { icon: '📅', label: 'PARTIDOS', path: '/matches' },
  { icon: '📊', label: 'TABLA', path: '/standings', active: true },
];

const s: Record<string, CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },

  sidebar: { width: 80, backgroundColor: '#22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, position: 'sticky', top: 0, height: '100vh' },
  sideTop: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 12, width: '100%' },
  sidebarLogo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 12 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 6px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', borderRadius: 8, width: '90%' },
  navActive: { backgroundColor: 'rgba(0,0,0,0.15)', color: '#fff' },
  navLabel: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: 'inherit' },
  bottomAvatar: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#166534', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 },

  main: { flex: 1, padding: '28px 32px', overflowY: 'auto' },
  pageTitle: { fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 20 },
  loading: { color: '#888', fontSize: 13 },

  layout: { display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, alignItems: 'start' },
  tableSection: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },

  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f9f9f7' },
  th: { padding: '10px 10px', fontSize: 10, fontWeight: 800, color: '#aaa', textAlign: 'center', borderBottom: '1px solid #f0f0f0', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' },
  trHighlight: {},
  td: { padding: '10px 10px', fontSize: 12, color: '#333', textAlign: 'center', verticalAlign: 'middle' },
  emptyCell: { textAlign: 'center', color: '#bbb', padding: '40px', fontSize: 13 },

  teamCell: { display: 'flex', alignItems: 'center', gap: 10 },
  teamBadge: { width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 },
  teamName: { fontSize: 13, fontWeight: 700, color: '#111', margin: 0 },
  captainName: { fontSize: 10, color: '#aaa', margin: 0 },

  formRow: { display: 'flex', gap: 3, justifyContent: 'center' },
  formDot: { width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff' },

  rightCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  highlightCard: { backgroundColor: '#fff', borderRadius: 12, padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 },
  highlightImg: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#f0f0ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
  highlightLabel: { fontSize: 10, color: '#aaa', fontWeight: 600, margin: 0 },
  highlightName: { fontSize: 13, fontWeight: 800, color: '#111', margin: 0 },
};