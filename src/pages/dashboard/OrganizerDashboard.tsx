import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import TeamService from '../../services/team.service';
import TournamentService from '../../services/tournament.service';
import MatchService from '../../services/match.service';
import type { Team, Tournament, Match, StandingDTO } from '../../types';

export default function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const [monthFilter] = useState('Mes');
  const [tournamentFilter, setTournamentFilter] = useState('');

  const { data: teams } = useFetch<Team[]>(() => TeamService.getAll());
  const { data: tournaments } = useFetch<Tournament[]>(() => TournamentService.getAll());
  const { data: matches } = useFetch<Match[]>(() => MatchService.getAll());

  const activeTournament = (tournaments ?? []).find((t) => t.status === 'En progreso' || t.status === 'Activo');
  const { data: standings } = useFetch<StandingDTO[]>(
    () => activeTournament ? TournamentService.getStandings(activeTournament.id) : Promise.resolve([]),
    [activeTournament?.id],
  );

  const userName = user?.email?.split('@')[0] ?? 'Organizador';
  const teamsCount = teams?.length ?? 0;
  const matchesPlayed = (matches ?? []).filter((m) => m.status === 'Finalizado').length;
  const nextMatch = (matches ?? []).find((m) => m.status === 'Programado');

  // Match creation mini-form state
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<string | null>(null);

  const handleCreateMatch = async () => {
    if (!homeTeamId || !awayTeamId || !matchDate) { setCreateMsg('⚠️ Completa todos los campos'); return; }
    setCreating(true); setCreateMsg(null);
    try {
      await import('../../services/apiClient').then(({ default: api }) =>
        api.post('/api/v1/matches', {
          homeTeamId: parseInt(homeTeamId),
          awayTeamId: parseInt(awayTeamId),
          matchDate,
          tournamentId: activeTournament?.id,
        })
      );
      setCreateMsg('✅ Partido creado');
      setHomeTeamId(''); setAwayTeamId(''); setMatchDate('');
    } catch (e) {
      setCreateMsg(`⚠️ ${e instanceof Error ? e.message : 'Error'}`);
    } finally {
      setCreating(false);
    }
  };

  const formatNextMatch = () => {
    if (!nextMatch) return 'Sin partidos programados';
    const d = new Date(nextMatch.matchDate);
    return `${d.toLocaleDateString('es-CO', { month: 'long', day: 'numeric' }).toUpperCase()} / ${d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} P.M`;
  };

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sidebarLogo}>
            <div style={s.logoBox}><span>⚽</span></div>
            <span style={s.logoText}>TechCup</span>
          </div>
          {ORG_NAV.map(({ icon, label, path, active }) => (
            <a key={label} href={path} style={{ ...s.navItem, ...(active ? s.navActive : {}) }}>
              <span style={s.navIcon}>{icon}</span>
              <span style={s.navLabel}>{label}</span>
            </a>
          ))}
        </div>
        <button style={s.addBtn}>+</button>
      </aside>

      <div style={s.content}>
        {/* Topbar */}
        <header style={s.topBar}>
          <div style={s.topBarLeft}>
            <div style={s.greenBar} />
          </div>
          <div style={s.searchWrap}>
            <span>🔍</span>
            <input style={s.searchInput} placeholder="Search Matches, Players, Stats ..." />
          </div>
          <div style={s.topRight}>
            <span style={s.iconBtn}>🔔</span>
            <span style={s.iconBtn}>✉️</span>
            <div style={s.roleTag}>ORGANIZADOR</div>
            <div style={s.userChip}>
              <div style={s.avatar}>{userName.slice(0, 2).toUpperCase()}</div>
              <span style={s.userName}>{userName.charAt(0).toUpperCase() + userName.slice(1)}</span>
              <button onClick={logout} style={s.chevron}>▾</button>
            </div>
          </div>
        </header>

        {/* Body */}
        <main style={s.body}>
          {/* Welcome */}
          <div style={s.welcomeCard}>
            <h2 style={s.welcomeTitle}>¡BIENVENIDO DE VUELTA, {userName.toUpperCase()}!</h2>
            <div style={s.statsRow}>
              <StatChip icon="⚽" label="EQUIPOS INSCRITOS" value={`${teamsCount === 3 ? 'TRES' : teamsCount} (${teamsCount})`} />
              <StatChip icon="⚽" label="PARTIDOS JUGADOS" value={`${matchesPlayed}/${(matches ?? []).length}`} />
              <StatChip icon="📅" label="PRÓXIMO PARTIDO" value={formatNextMatch()} />
            </div>
          </div>

          <div style={s.threeCol}>
            {/* Match schedule */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>Texto Pequeño</span>
                <div style={s.filterRowSmall}>
                  <span>Filtrar</span>
                  <select style={s.miniSelect}><option>Mes</option></select>
                  <select style={s.miniSelect}><option>Equipo</option></select>
                  <select style={s.miniSelect}><option>Fecha</option></select>
                </div>
              </div>

              {(matches ?? []).length === 0 ? (
                <p style={s.emptyText}>Sin partidos programados</p>
              ) : (
                (matches ?? []).slice(0, 3).map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))
              )}
              <a href="/matches" style={s.seeAll}>Ver Completa →</a>
            </div>

            {/* Standings */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div>
                  <span style={s.cardTitle}>TABLA DE POSICIONES</span>
                  {activeTournament && (
                    <p style={s.cardSub}>Jardines · {activeTournament.startDate?.slice(0, 4) ?? '2025'}</p>
                  )}
                </div>
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>N°</th>
                    <th style={{ ...s.th, textAlign: 'left' }}>EQUIPO</th>
                    <th style={s.th}>PJ</th>
                    <th style={s.th}>PG</th>
                    <th style={s.th}>GF</th>
                  </tr>
                </thead>
                <tbody>
                  {(standings ?? []).slice(0, 5).map((st, i) => (
                    <tr key={st.teamId}>
                      <td style={{ ...s.td, fontWeight: 800, color: i === 0 ? '#22c55e' : '#333' }}>{i + 1}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{st.teamName}</td>
                      <td style={s.td}>{st.matchesPlayed}</td>
                      <td style={s.td}>{st.matchesWon}</td>
                      <td style={s.td}>{st.goalsFor}</td>
                    </tr>
                  ))}
                  {(standings ?? []).length === 0 && [1,2,3,4,5].map((n) => (
                    <tr key={n}>
                      <td style={{ ...s.td, fontWeight: 800 }}>{n}</td>
                      <td style={s.td}>{n === 1 ? 'League Fooot' : ''}</td>
                      <td style={s.td}>0</td><td style={s.td}>0</td><td style={s.td}>0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a href="/standings" style={s.seeAll}>Ver Completa →</a>
            </div>

            {/* Right panel */}
            <div style={s.rightCol}>
              {/* Quick management */}
              <div style={s.card}>
                <span style={s.cardTitle}>GESTIÓN RÁPIDA</span>
                {/* Trending */}
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                  <p style={s.trendLabel}>TENDENCIAS</p>
                  <p style={s.trendSub}>VARIAS TARJETAS ROJAS</p>
                  <div style={s.trendPlayer}>
                    <div style={s.trendAvatar}>👤</div>
                    <div>
                      <p style={s.trendName}>Nicolas Garcia</p>
                      <p style={s.trendDetail}>2 TARJETAS ROJAS</p>
                    </div>
                  </div>
                  <a href="/players/1" style={s.verPerfil}>Ver Perfil</a>
                </div>
              </div>

              {/* Create match mini-form */}
              <div style={s.card}>
                <span style={s.cardTitle}>Creación de Partido</span>
                <select style={s.input} value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}>
                  <option value="">Equipo 1</option>
                  {(teams ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select style={s.input} value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}>
                  <option value="">Equipo 2</option>
                  {(teams ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <input style={s.input} placeholder="Campo de Juego" />
                <input style={s.input} type="datetime-local" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
                <select style={s.input}><option>Árbitro</option></select>
                {createMsg && <p style={{ fontSize: 11, color: '#3a6b35' }}>{createMsg}</p>}
                <button style={s.createMatchBtn} onClick={handleCreateMatch} disabled={creating}>
                  {creating ? 'Creando...' : 'Crear Ahora'}
                </button>
                <a href="/matches" style={{ ...s.seeAll, textAlign: 'center' }}>Todos los Partidos</a>
              </div>
            </div>
          </div>

          {/* New tournament CTA */}
          <div style={s.newTournamentCard}>
            <span style={{ fontSize: 24 }}>+</span>
            <span style={s.newTournamentText}>Nuevo Torneo</span>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatChip({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>{label}</div>
        <div style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

function MatchRow({ match }: { match: Match }) {
  const d = new Date(match.matchDate);
  return (
    <div style={s.matchRow}>
      <div style={s.matchBar} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>Reprogramación</p>
      </div>
      <div style={s.matchDateBadge}>
        <p style={{ fontSize: 10, margin: 0 }}>Fecha : {d.toLocaleDateString('es-CO', { month: 'long', day: 'numeric' })}</p>
        <p style={{ fontSize: 10, margin: 0 }}>Hora: {d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} p.m</p>
      </div>
    </div>
  );
}

const ORG_NAV = [
  { icon: '⊞', label: 'INICIO', path: '/organizer/dashboard', active: true },
  { icon: '👥', label: 'EQUIPOS', path: '/teams' },
  { icon: '📊', label: 'ESTADÍSTICAS', path: '/standings' },
  { icon: '📅', label: 'PARTIDOS', path: '/matches' },
  { icon: '🏆', label: 'TORNEOS', path: '/tournaments' },
];

const s: Record<string, CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  sidebar: { width: 80, backgroundColor: '#22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, position: 'sticky', top: 0, height: '100vh' },
  sideTop: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 12, width: '100%' },
  sidebarLogo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 10 },
  logoBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  logoText: { fontSize: 8, fontWeight: 700, color: '#fff', letterSpacing: 1 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 6px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', borderRadius: 8, width: '90%' },
  navActive: { backgroundColor: 'rgba(0,0,0,0.15)', color: '#fff' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: 'inherit' },
  addBtn: { width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' },

  content: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', height: 64, gap: 16 },
  topBarLeft: { display: 'flex', alignItems: 'center' },
  greenBar: { width: 4, height: 32, backgroundColor: '#22c55e', borderRadius: 2, marginRight: 12 },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#22c55e', borderRadius: 20, padding: '8px 18px', flex: 1, maxWidth: 400 },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, flex: 1, fontFamily: 'inherit' },
  topRight: { display: 'flex', alignItems: 'center', gap: 12 },
  iconBtn: { fontSize: 18, cursor: 'pointer' },
  roleTag: { backgroundColor: '#1e3a8a', color: '#fff', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1 },
  userChip: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  userName: { fontSize: 13, fontWeight: 600 },
  chevron: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 },

  body: { flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  welcomeCard: { backgroundColor: '#fff', borderRadius: 12, padding: '20px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  welcomeTitle: { fontSize: 16, fontWeight: 800, letterSpacing: 1, marginBottom: 16, color: '#222' },
  statsRow: { display: 'flex', gap: 40 },

  threeCol: { display: 'grid', gridTemplateColumns: '1.4fr 1fr 240px', gap: 16, alignItems: 'start' },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 10 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  cardTitle: { fontSize: 12, fontWeight: 800, color: '#222', letterSpacing: 0.8 },
  cardSub: { fontSize: 10, color: '#aaa', margin: 0 },
  filterRowSmall: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#888' },
  miniSelect: { fontSize: 10, border: '1px solid #ddd', borderRadius: 4, padding: '3px 6px', backgroundColor: '#fff', fontFamily: 'inherit' },
  emptyText: { fontSize: 12, color: '#bbb', textAlign: 'center', padding: '12px 0' },
  seeAll: { fontSize: 12, color: '#22c55e', fontWeight: 700, textDecoration: 'none', textAlign: 'right', paddingTop: 4 },

  matchRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  matchBar: { width: 6, height: 36, borderRadius: 3, backgroundColor: '#22c55e', flexShrink: 0 },
  matchDateBadge: { backgroundColor: '#22c55e', borderRadius: 8, padding: '4px 10px', color: '#fff', textAlign: 'right' },

  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '6px 8px', fontSize: 9, fontWeight: 700, color: '#aaa', textAlign: 'center', borderBottom: '1px solid #f0f0f0', letterSpacing: 0.5 },
  td: { padding: '8px 8px', fontSize: 11, color: '#333', textAlign: 'center' },

  rightCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  trendLabel: { fontSize: 10, fontWeight: 800, color: '#ef4444', letterSpacing: 0.5, margin: '0 0 2px' },
  trendSub: { fontSize: 9, color: '#aaa', margin: '0 0 10px' },
  trendPlayer: { display: 'flex', alignItems: 'center', gap: 10 },
  trendAvatar: { width: 48, height: 48, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  trendName: { fontSize: 13, fontWeight: 700, margin: 0 },
  trendDetail: { fontSize: 10, color: '#aaa', margin: 0 },
  verPerfil: { display: 'inline-block', backgroundColor: '#22c55e', color: '#fff', borderRadius: 6, padding: '5px 14px', fontSize: 11, fontWeight: 700, textDecoration: 'none', marginTop: 8 },

  input: { backgroundColor: '#f5f5f0', border: '1px solid #e0e0dc', borderRadius: 8, padding: '9px 12px', fontSize: 12, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' },
  createMatchBtn: { backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },

  newTournamentCard: { backgroundColor: '#22c55e', borderRadius: 12, padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' },
  newTournamentText: { fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: 3, fontFamily: "'Bebas Neue','Rajdhani',sans-serif" },
};