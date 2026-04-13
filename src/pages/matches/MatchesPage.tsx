import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import MatchService from '../../services/match.service';
import TeamService from '../../services/team.service';
import type { Match, Team } from '../../types';

const NAV = [
  { icon: '⊞', label: 'INICIO', path: '/standings' },
  { icon: '👥', label: 'EQUIPOS', path: '/teams' },
  { icon: '📅', label: 'PARTIDOS', path: '/matches', active: true },
  { icon: '📊', label: 'TABLA', path: '/standings' },
];

const STATUS_COLOR: Record<string, string> = {
  Finalizado: '#22c55e',
  Programado: '#3b82f6',
  'En curso': '#f59e0b',
};

export default function MatchesPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.email?.split('@')[0] ?? '';

  const { data: matches, loading } = useFetch<Match[]>(() => MatchService.getAll());
  const { data: teams } = useFetch<Team[]>(() => TeamService.getAll());

  const [statusFilter, setStatusFilter] = useState('Todos');

  const getTeamName = (id: number) => teams?.find((t) => t.id === id)?.name ?? `Equipo ${id}`;

  const filtered = (matches ?? []).filter((m) =>
    statusFilter === 'Todos' || m.status === statusFilter
  );

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sidebarLogo}>
            <div style={s.logoBox}><span style={{ fontSize: 20 }}>⚽</span></div>
            <span style={s.logoText}>TechCup</span>
          </div>
          {NAV.map(({ icon, label, path, active }) => (
            <a key={label} href={path} style={{ ...s.navItem, ...(active ? s.navActive : {}) }}>
              <span>{icon}</span>
              <span style={s.navLabel}>{label}</span>
            </a>
          ))}
        </div>
        <div style={s.bottomAvatar}>{userName.slice(0, 2).toUpperCase()}</div>
      </aside>

      <main style={s.main}>
        <div style={s.header}>
          <h2 style={s.pageTitle}>Partidos</h2>
          <div style={s.filters}>
            {['Todos', 'Programado', 'En curso', 'Finalizado'].map((f) => (
              <button
                key={f}
                style={{ ...s.filterBtn, ...(statusFilter === f ? s.filterBtnActive : {}) }}
                onClick={() => setStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={s.emptyText}>Cargando partidos...</p>
        ) : filtered.length === 0 ? (
          <div style={s.emptyState}>
            <span style={{ fontSize: 48 }}>📅</span>
            <p>No hay partidos {statusFilter !== 'Todos' ? `con estado "${statusFilter}"` : ''}</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((m) => (
              <div
                key={m.id}
                style={s.matchCard}
                onClick={() => navigate(`/matches/${m.id}`)}
              >
                <div style={s.matchCardTop}>
                  <span style={{ ...s.statusBadge, backgroundColor: STATUS_COLOR[m.status] ?? '#aaa' }}>
                    {m.status}
                  </span>
                  <span style={s.matchDate}>
                    {new Date(m.matchDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={s.matchTeams}>
                  <div style={s.teamBlock}>
                    <div style={s.teamBadge}>{getTeamName(m.homeTeamId).slice(0, 2).toUpperCase()}</div>
                    <span style={s.teamName}>{getTeamName(m.homeTeamId)}</span>
                  </div>
                  <div style={s.score}>
                    {m.status === 'Finalizado'
                      ? `${m.homeGoals ?? 0} - ${m.awayGoals ?? 0}`
                      : 'VS'
                    }
                  </div>
                  <div style={s.teamBlock}>
                    <div style={{ ...s.teamBadge, backgroundColor: '#3b82f6' }}>{getTeamName(m.awayTeamId).slice(0, 2).toUpperCase()}</div>
                    <span style={s.teamName}>{getTeamName(m.awayTeamId)}</span>
                  </div>
                </div>

                {m.field && <p style={s.matchField}>📍 {m.field}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  sidebar: { width: 80, backgroundColor: '#22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, position: 'sticky', top: 0, height: '100vh' },
  sideTop: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 12, width: '100%' },
  sidebarLogo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 12 },
  logoBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 8, fontWeight: 700, color: '#fff', letterSpacing: 1 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 6px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', borderRadius: 8, width: '90%' },
  navActive: { backgroundColor: 'rgba(0,0,0,0.15)', color: '#fff' },
  navLabel: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: 'inherit' },
  bottomAvatar: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#166534', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 },

  main: { flex: 1, padding: '28px 32px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111' },
  filters: { display: 'flex', gap: 8 },
  filterBtn: { border: '1.5px solid #ddd', borderRadius: 20, padding: '6px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', fontFamily: 'inherit' },
  filterBtnActive: { backgroundColor: '#22c55e', borderColor: '#22c55e', color: '#fff' },

  emptyText: { color: '#888', fontSize: 13 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0', color: '#aaa', fontSize: 14 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  matchCard: { backgroundColor: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.15s', },
  matchCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { color: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700 },
  matchDate: { fontSize: 11, color: '#888' },
  matchTeams: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  teamBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 },
  teamBadge: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 },
  teamName: { fontSize: 12, fontWeight: 700, textAlign: 'center', color: '#333' },
  score: { fontSize: 22, fontWeight: 900, color: '#111', minWidth: 60, textAlign: 'center' },
  matchField: { fontSize: 11, color: '#888', margin: 0 },
};