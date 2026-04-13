import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import PlayerService from '../../services/player.service';
import TournamentService from '../../services/tournament.service';
import type { ProfileDTO, Tournament } from '../../types';

const ADMIN_NAV = [
  { icon: '⊞', label: 'INICIO', path: '/admin/dashboard', active: true },
  { icon: '👥', label: 'USUARIOS', path: '/admin/users' },
  { icon: '🔑', label: 'PERMISOS', path: '/admin/permisos' },
  { icon: '⚙️', label: 'CONFIGURACIÓN', path: '/admin/config' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const userName = user?.email?.split('@')[0] ?? 'Admin';

  const { data: players, loading: loadingPlayers } = useFetch<ProfileDTO[]>(() => PlayerService.getAll());
  const { data: tournaments } = useFetch<Tournament[]>(() => TournamentService.getAll());

  const [roleFilter, setRoleFilter] = useState('TODOS LOS ROLES');
  const [search, setSearch] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('TODOS LOS ESTADOS');

  const filteredPlayers = (players ?? []).filter((p) => {
    const matchRole = roleFilter === 'TODOS LOS ROLES' || p.userType === roleFilter;
    const matchSearch = !search || p.fullName?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.sidebarLogo}>
            <div style={s.logoBox}><span style={{ fontSize: 20 }}>⚽</span></div>
            <span style={s.logoText}>TechCup</span>
          </div>
          {ADMIN_NAV.map(({ icon, label, path, active }) => (
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
          <div style={s.searchWrap}>
            <span>🔍</span>
            <input
              style={s.searchInput}
              placeholder="Search Matches, Players, Stats ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={s.topRight}>
            <span style={s.iconBtn}>🔔</span>
            <span style={s.iconBtn}>✉️</span>
            <div style={s.roleTag}>ADMINISTRADOR</div>
            <div style={s.userChip}>
              <div style={s.avatar}>{userName.slice(0, 2).toUpperCase()}</div>
              <span style={s.userName}>{userName.charAt(0).toUpperCase() + userName.slice(1)}</span>
              <button onClick={logout} style={s.chevron}>▾</button>
            </div>
          </div>
        </header>

        <main style={s.body}>
          {/* Welcome */}
          <div style={s.welcomeCard}>
            <h2 style={s.welcomeTitle}>¡BIENVENIDO DE VUELTA, {userName.toUpperCase()}!</h2>
            <div style={s.statsRow}>
              <StatChip icon="👥" label="USUARIOS" value={(players ?? []).length} />
              <StatChip icon="🏆" label="TORNEOS 2026" value={(tournaments ?? []).length} />
              <StatChip icon="⚽" label="PARTIDOS 2026" value={0} />
            </div>
          </div>

          <div style={s.threeCol}>
            {/* Users table */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>GESTIÓN DE USUARIOS</h3>
              <div style={s.filterRow}>
                <span style={s.filterLabel}>Filtrar</span>
                <select style={s.miniSelect} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  {['TODOS LOS ROLES', 'ADMIN', 'ORGANIZADOR', 'CAPITAN', 'JUGADOR', 'ARBITRO'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <input
                  style={s.searchSmall}
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loadingPlayers ? (
                <p style={s.emptyText}>Cargando...</p>
              ) : filteredPlayers.length === 0 ? (
                <p style={s.emptyText}>No hay usuarios</p>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nombre</th>
                      <th style={s.th}>Rol</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Último</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.slice(0, 5).map((p) => (
                      <tr key={p.id} style={s.tr}>
                        <td style={s.tdLeft}>
                          <div style={s.playerCell}>
                            <div style={s.playerAvatar}>{p.fullName?.slice(0, 2).toUpperCase() ?? 'NA'}</div>
                            <div>
                              <div style={s.playerName}>{p.fullName}</div>
                              <div style={s.playerRole}>{p.userType}</div>
                            </div>
                          </div>
                        </td>
                        <td style={s.td}>{p.userType}</td>
                        <td style={s.td}><span style={s.activeTag}>Activo</span></td>
                        <td style={s.td}>—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <a href="/admin/users" style={s.seeAll}>Ver Completa →</a>
            </div>

            {/* Tournament history */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>HISTORIAL TORNEOS</h3>
              <select style={s.miniSelect} value={tournamentFilter} onChange={(e) => setTournamentFilter(e.target.value)}>
                {['TODOS LOS ESTADOS', 'Activo', 'Finalizado', 'Borrador'].map((s) => <option key={s}>{s}</option>)}
              </select>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {(tournaments ?? []).length === 0
                  ? [1,2,3,4,5].map((n) => (
                    <div key={n} style={s.tournamentRow}>
                      <div style={s.tournamentNum}>{n}</div>
                    </div>
                  ))
                  : (tournaments ?? []).slice(0, 5).map((t, i) => (
                    <div key={t.id} style={s.tournamentRow}>
                      <div style={s.tournamentNum}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 12 }}>Torneo {t.id}</div>
                      <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{t.status}</span>
                    </div>
                  ))}
              </div>
              <a href="/tournaments" style={s.seeAll}>Ver Completa →</a>
            </div>

            {/* Right panel */}
            <div style={s.rightCol}>
              {/* Quick tools */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>HERRAMIENTAS RÁPIDAS</h3>
                <div style={s.toolSection}>
                  <p style={s.toolSectionTitle}>ERRORES RECIENTES</p>
                  <p style={s.toolSub}>FALLAS TÉCNICAS</p>
                  <div style={s.errorItem}>
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <span style={{ fontSize: 11, color: '#555' }}>ERROR AL GENERAR A LA REPROGRAMACIÓN</span>
                  </div>
                  <button style={s.verMasBtn}>VER MÁS</button>
                </div>
              </div>

              <div style={s.card}>
                <h3 style={s.cardTitle}>CONFIGURACIÓN GENERAL</h3>
                {[
                  { icon: '⚙️', label: 'AJUSTES DEL SISTEMA' },
                  { icon: '⚽', label: 'CAMPOS DE JUEGOS' },
                  { icon: '✉️', label: 'REGISTROS Y LOGOS' },
                  { icon: '🔔', label: 'ADMINISTRADOR NOTIFICACIONES' },
                ].map((item) => (
                  <div key={item.label} style={s.configItem}>
                    <span>{item.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <h3 style={s.cardTitle}>ACTIVIDAD RECIENTE</h3>
                {(players ?? []).slice(0, 2).map((p) => (
                  <div key={p.id} style={s.activityItem}>
                    <div style={{ ...s.activityAvatar, backgroundColor: '#22c55e' }}>
                      {p.fullName?.slice(0, 2).toUpperCase() ?? 'NA'}
                    </div>
                    <div>
                      <p style={s.activityName}>{p.fullName}</p>
                      <p style={s.activityDetail}>Se ha unido al equipo</p>
                    </div>
                  </div>
                ))}
                <a href="/admin/activity" style={s.seeAll}>Ver más</a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>{value}</div>
        <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  sidebar: { width: 80, backgroundColor: '#8b5cf6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, position: 'sticky', top: 0, height: '100vh' },
  sideTop: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 12, width: '100%' },
  sidebarLogo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 10 },
  logoBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 8, fontWeight: 700, color: '#fff', letterSpacing: 1 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 6px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', borderRadius: 8, width: '90%' },
  navActive: { backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: 'inherit' },
  addBtn: { width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' },

  content: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', height: 64, gap: 16 },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#8b5cf6', borderRadius: 20, padding: '8px 18px', flex: 1, maxWidth: 400 },
  searchInput: { background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, flex: 1, fontFamily: 'inherit' },
  topRight: { display: 'flex', alignItems: 'center', gap: 12 },
  iconBtn: { fontSize: 18, cursor: 'pointer' },
  roleTag: { backgroundColor: '#8b5cf6', color: '#fff', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1 },
  userChip: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  userName: { fontSize: 13, fontWeight: 600 },
  chevron: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 },

  body: { flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  welcomeCard: { backgroundColor: '#fff', borderRadius: 12, padding: '20px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  welcomeTitle: { fontSize: 16, fontWeight: 800, letterSpacing: 1, marginBottom: 16, color: '#222' },
  statsRow: { display: 'flex', gap: 40 },

  threeCol: { display: 'grid', gridTemplateColumns: '1.4fr 1fr 240px', gap: 16, alignItems: 'start' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 10 },
  cardTitle: { fontSize: 12, fontWeight: 800, color: '#222', letterSpacing: 0.8 },
  filterRow: { display: 'flex', alignItems: 'center', gap: 8 },
  filterLabel: { fontSize: 11, color: '#888' },
  miniSelect: { fontSize: 10, border: '1px solid #ddd', borderRadius: 4, padding: '3px 6px', backgroundColor: '#fff', fontFamily: 'inherit' },
  searchSmall: { fontSize: 11, border: '1px solid #ddd', borderRadius: 4, padding: '3px 8px', flex: 1, outline: 'none' },
  emptyText: { fontSize: 12, color: '#bbb', textAlign: 'center', padding: '12px 0' },
  seeAll: { fontSize: 12, color: '#8b5cf6', fontWeight: 700, textDecoration: 'none', textAlign: 'right', paddingTop: 4 },

  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '6px 8px', fontSize: 9, fontWeight: 700, color: '#aaa', textAlign: 'left', borderBottom: '1px solid #f0f0f0' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '8px 8px', fontSize: 11, color: '#333', textAlign: 'center' },
  tdLeft: { padding: '8px 8px', fontSize: 11, color: '#333', textAlign: 'left' },
  playerCell: { display: 'flex', alignItems: 'center', gap: 8 },
  playerAvatar: { width: 28, height: 28, borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 },
  playerName: { fontSize: 12, fontWeight: 700, margin: 0 },
  playerRole: { fontSize: 10, color: '#aaa', margin: 0 },
  activeTag: { backgroundColor: '#dcfce7', color: '#166534', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700 },

  tournamentRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  tournamentNum: { width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 },

  rightCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  toolSection: { display: 'flex', flexDirection: 'column', gap: 8 },
  toolSectionTitle: { fontSize: 11, fontWeight: 800, color: '#333', margin: 0 },
  toolSub: { fontSize: 9, color: '#aaa', margin: 0 },
  errorItem: { display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#fef9f0', borderRadius: 8, padding: '8px' },
  verMasBtn: { backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-end' },
  configItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid #f5f5f5' },
  activityItem: { display: 'flex', alignItems: 'center', gap: 10 },
  activityAvatar: { width: 32, height: 32, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  activityName: { fontSize: 12, fontWeight: 700, margin: 0 },
  activityDetail: { fontSize: 10, color: '#aaa', margin: 0 },
};