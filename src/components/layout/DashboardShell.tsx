import type { CSSProperties, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLogo } from '../AppLogo';

export type ShellAccent = 'green' | 'purple' | 'organizer';

const ACCENT: Record<ShellAccent, { sidebar: string; search: string; rolePill: CSSProperties; avatar: string }> = {
  green: {
    sidebar: '#15803d',
    search: '#22c55e',
    rolePill: { backgroundColor: '#22c55e', color: '#fff' },
    avatar: '#22c55e',
  },
  purple: {
    sidebar: '#8b5cf6',
    search: '#8b5cf6',
    rolePill: { backgroundColor: '#8b5cf6', color: '#fff' },
    avatar: '#8b5cf6',
  },
  organizer: {
    sidebar: '#22c55e',
    search: '#22c55e',
    rolePill: { backgroundColor: '#1e3a8a', color: '#fff' },
    avatar: '#f59e0b',
  },
};

export function DashboardShell({
  accent,
  navItems,
  roleLabel,
  userName,
  userInitials,
  onLogout,
  children,
  searchPlaceholder = 'Search Matches, Players, Stats ...',
  notifyCount = 1,
}: {
  accent: ShellAccent;
  navItems: { icon: string; label: string; path: string }[];
  roleLabel: string;
  userName: string;
  userInitials: string;
  onLogout: () => void;
  children: ReactNode;
  searchPlaceholder?: string;
  notifyCount?: number;
}) {
  const { pathname } = useLocation();
  const a = ACCENT[accent];

  const isActive = (path: string) =>
    pathname === path || (path.length > 1 && pathname.startsWith(path));

  return (
    <div style={s.root}>
      <aside style={{ ...s.sidebar, backgroundColor: a.sidebar }}>
        <div style={s.sideTop}>
          <div style={s.sidebarLogo}>
            <AppLogo height={44} />
          </div>
          {navItems.map(({ icon, label, path }) => (
            <Link
              key={label}
              to={path}
              style={{ ...s.navItem, ...(isActive(path) ? s.navActive : {}) }}
            >
              <span style={s.navIcon}>{icon}</span>
              <span style={s.navLabel}>{label}</span>
            </Link>
          ))}
        </div>
        <div style={s.bottomAvatar}>{userInitials}</div>
      </aside>

      <div style={s.content}>
        <header style={s.topBar}>
          <div style={{ ...s.searchWrap, backgroundColor: a.search }}>
            <span aria-hidden>{'\u{1F50D}'}</span>
            <input style={s.searchInput} placeholder={searchPlaceholder} readOnly />
          </div>
          <div style={s.topRight}>
            <span style={s.iconBtn}>
              {'\u{1F514}'}
              {notifyCount > 0 ? <span style={s.badge}>{notifyCount}</span> : null}
            </span>
            <span style={s.iconBtn}>{'\u2709\uFE0F'}</span>
            <div style={{ ...s.roleTag, ...a.rolePill }}>{roleLabel}</div>
            <div style={s.userChip}>
              <div style={{ ...s.avatar, backgroundColor: a.avatar }}>{userInitials}</div>
              <span style={s.userName}>{userName}</span>
              <button type="button" onClick={onLogout} style={s.chevron} aria-label="Cerrar sesión">
                {'\u25BE'}
              </button>
            </div>
          </div>
        </header>
        <main style={s.main}>{children}</main>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f0',
    fontFamily: "'Rajdhani','Segoe UI',sans-serif",
  },
  sidebar: {
    width: 88,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  sideTop: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingTop: 14,
    width: '100%',
  },
  sidebarLogo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 8 },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '10px 6px',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    width: '90%',
  },
  navActive: { backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: 'inherit', textAlign: 'center' },
  bottomAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: '#15803d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 8,
  },
  content: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    minHeight: 64,
    gap: 16,
    zIndex: 2,
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 20,
    padding: '8px 18px',
    flex: 1,
    maxWidth: 480,
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 13,
    flex: 1,
    fontFamily: 'inherit',
  },
  topRight: { display: 'flex', alignItems: 'center', gap: 12 },
  iconBtn: { fontSize: 18, cursor: 'pointer', position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: 9,
    fontWeight: 800,
    borderRadius: 8,
    padding: '1px 5px',
  },
  roleTag: { borderRadius: 6, padding: '5px 14px', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 },
  userChip: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
  },
  userName: { fontSize: 13, fontWeight: 600, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' },
  chevron: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 },
  main: { flex: 1, padding: '20px 28px 32px', overflowY: 'auto' },
};
