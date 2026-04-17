import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMemo, useState, type ReactNode } from 'react';
import { AUTH_IMAGE_ASSETS } from '../../features/auth/constants';
import type { ProfileDTO } from '../../types';

type PortalBasePath = '/player' | '/captain' | '/organizer' | '/admin' | '/referee';

interface PortalShellProps {
  title: string;
  roleLabel: string;
  basePath: PortalBasePath;
  player: ProfileDTO | null;
  children: ReactNode;
}

interface PortalNavItem {
  to: string;
  label: string;
}

export default function PortalShell({ title, roleLabel, basePath, player, children }: PortalShellProps) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const displayName = useMemo(() => player?.fullName ?? 'Jugador TechCup', [player?.fullName]);

  const navItems = useMemo<PortalNavItem[]>(() => {
    if (basePath === '/admin') {
      return [
        { to: `${basePath}/dashboard`, label: 'INICIO' },
        { to: `${basePath}/users`, label: 'USUARIOS' },
        { to: `${basePath}/tournaments`, label: 'TORNEOS' },
        { to: `${basePath}/matches`, label: 'PARTIDOS' },
        { to: `${basePath}/stats`, label: 'ESTADÍSTICAS' },
        { to: `${basePath}/settings`, label: 'CONFIGURACIÓN' },
      ];
    }
    if (basePath === '/organizer') {
      return [
        { to: `${basePath}/dashboard`, label: 'INICIO' },
        { to: `${basePath}/team`, label: 'MI EQUIPO' },
        { to: `${basePath}/tournaments`, label: 'TORNEOS' },
        { to: `${basePath}/matches`, label: 'PARTIDOS' },
        { to: `${basePath}/stats`, label: 'ESTADÍSTICAS' },
      ];
    }
    if (basePath === '/referee') {
      return [
        { to: `${basePath}/dashboard`, label: 'INICIO' },
        { to: `${basePath}/team`, label: 'MI EQUIPO' },
        { to: `${basePath}/tournaments`, label: 'TORNEOS' },
        { to: `${basePath}/matches`, label: 'PARTIDOS' },
        { to: `${basePath}/stats`, label: 'ESTADÍSTICAS' },
      ];
    }
    return [
      { to: `${basePath}/dashboard`, label: 'INICIO' },
      { to: `${basePath}/team`, label: 'MI EQUIPO' },
      { to: `${basePath}/tournaments`, label: 'TORNEOS' },
      { to: `${basePath}/matches`, label: 'PARTIDOS' },
      { to: `${basePath}/stats`, label: 'ESTADÍSTICAS' },
    ];
  }, [basePath]);

  const roleClassName = useMemo(() => {
    if (basePath === '/admin') return 'tc-role-admin';
    if (basePath === '/organizer') return 'tc-role-organizer';
    return '';
  }, [basePath]);

  const logout = () => {
    localStorage.removeItem('tc_user');
    navigate('/login');
  };

  return (
    <main className="tc-portal-page">
      <header className="tc-portal-topbar">
        <Link to={`${basePath}/dashboard`} className="tc-portal-brand">
          <img
            src={AUTH_IMAGE_ASSETS.techcupLogo}
            alt="Logo TechCup"
            onError={(e) => {
              e.currentTarget.src = AUTH_IMAGE_ASSETS.schoolShield;
            }}
          />
        </Link>

        <nav className="tc-portal-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="tc-portal-right-actions">
          <div className="tc-portal-search">Buscar</div>
          <button className="tc-portal-avatar-btn" onClick={() => setShowMenu((s) => !s)} type="button">
            <span>◯</span>
          </button>
          {showMenu ? (
            <div className="tc-portal-user-menu">
              <button type="button" onClick={() => navigate(`${basePath}/profile`)}>
                Editar perfil
              </button>
              <button type="button" onClick={() => navigate(`${basePath}/dashboard`)}>
                Inicio
              </button>
              <button type="button" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <section className="tc-portal-headline">
        <div>
          <p className="tc-portal-welcome">{title}</p>
          <h1>{displayName.toUpperCase()}</h1>
          <span>{player?.email ?? 'sin-correo@techcup.local'}</span>
        </div>
        <div className={`tc-portal-role-chip ${roleClassName}`}>{roleLabel}</div>
      </section>

      <section className="tc-portal-content">{children}</section>
    </main>
  );
}
