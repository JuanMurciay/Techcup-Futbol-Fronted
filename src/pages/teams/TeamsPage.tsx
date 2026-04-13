import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import TeamService from '../../services/team.service';
import type { Team } from '../../types';
import { homePathFromStoredRole, normalizeRole } from '../../utils/roles';
import { AppLogo } from '../../components/AppLogo';

const BADGE_COLORS = ['#3b82f6','#ef4444','#8b5cf6','#f59e0b','#06b6d4','#ec4899','#22c55e'];

export default function TeamsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] ?? '';
  const isCaptain = normalizeRole(user?.role ?? '') === 'CAPTAIN';
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

  const { data: teams, loading } = useFetch<Team[]>(() => TeamService.getAll());

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sidebarLogo}>
            <AppLogo height={44} />
          </div>
          {nav.map(({ icon, label, path }) => (
            <a
              key={label}
              href={path}
              style={{ ...s.navItem, ...(path === '/teams' ? s.navActive : {}) }}
            >
              <span>{icon}</span>
              <span style={s.navLabel}>{label}</span>
            </a>
          ))}
        </div>
        <div style={s.bottomAvatar}>{userName.slice(0, 2).toUpperCase()}</div>
      </aside>

      <main style={s.main}>
        <div style={s.header}>
          <h2 style={s.pageTitle}>Equipos</h2>
          {isCaptain && (
            <button style={s.createBtn} onClick={() => navigate('/teams/create')}>
              + Crear Equipo
            </button>
          )}
        </div>

        {loading ? (
          <p style={s.emptyText}>Cargando equipos...</p>
        ) : (teams ?? []).length === 0 ? (
          <div style={s.emptyState}>
            <span style={{ fontSize: 48 }}>{'\u{1F465}'}</span>
            <p>No hay equipos registrados</p>
            {isCaptain && (
              <button style={s.createBtn} onClick={() => navigate('/teams/create')}>
                Crear el primer equipo
              </button>
            )}
          </div>
        ) : (
          <div style={s.grid}>
            {(teams ?? []).map((team, i) => {
              const colors = team.colors?.split(',') ?? [];
              const primary = colors[0] ?? BADGE_COLORS[i % BADGE_COLORS.length];
              return (
                <div key={team.id} style={s.teamCard} onClick={() => navigate(`/teams/${team.id}`)}>
                  {team.shieldUrl ? (
                    <img src={team.shieldUrl} alt={team.name} style={s.shield} />
                  ) : (
                    <div style={{ ...s.shieldPlaceholder, backgroundColor: primary }}>
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h3 style={s.teamName}>{team.name}</h3>
                  <p style={s.teamSub}>{(team.players ?? []).length} jugadores</p>
                  <div style={s.colorDots}>
                    {colors.map((c, ci) => (
                      <div key={ci} style={{ ...s.colorDot, backgroundColor: c }} />
                    ))}
                  </div>
                  {team.paymentStatus && (
                    <span style={{
                      ...s.paymentTag,
                      backgroundColor: team.paymentStatus === 'PAGADO' ? '#dcfce7' : '#fef3c7',
                      color: team.paymentStatus === 'PAGADO' ? '#166534' : '#92400e',
                    }}>
                      {team.paymentStatus}
                    </span>
                  )}
                </div>
              );
            })}
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
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 6px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', borderRadius: 8, width: '90%' },
  navActive: { backgroundColor: 'rgba(0,0,0,0.15)', color: '#fff' },
  navLabel: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: 'inherit' },
  bottomAvatar: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#166534', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 },

  main: { flex: 1, padding: '28px 32px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111' },
  createBtn: { backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  emptyText: { color: '#888', fontSize: 13 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 0', color: '#aaa', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  teamCard: { backgroundColor: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  shield: { width: 80, height: 80, objectFit: 'contain', borderRadius: 12 },
  shieldPlaceholder: { width: 80, height: 80, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 800 },
  teamName: { fontSize: 15, fontWeight: 800, color: '#111', textAlign: 'center' },
  teamSub: { fontSize: 11, color: '#aaa', margin: 0 },
  colorDots: { display: 'flex', gap: 6 },
  colorDot: { width: 16, height: 16, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)' },
  paymentTag: { borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700 },
};
