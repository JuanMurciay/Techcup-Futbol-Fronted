import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, type ReactNode } from 'react';
import { AUTH_IMAGE_ASSETS } from '../../features/auth/constants';
import type { ProfileDTO } from '../../types';

interface PortalShellProps {
  title: string;
  roleLabel: string;
  basePath: '/player' | '/captain';
  player: ProfileDTO | null;
  children: ReactNode;
}

export default function PortalShell({ title, roleLabel, basePath, player, children }: PortalShellProps) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = useMemo(() => player?.fullName ?? 'Jugador TechCup', [player?.fullName]);
  const currentHash = location.hash ?? '';

  const linkClassName = (isActive: boolean) => (isActive ? 'active' : '');
  const dashboardActive = location.pathname === `${basePath}/dashboard` && !currentHash;
  const matchesActive = location.pathname === `${basePath}/dashboard` && currentHash === '#matches';
  const statsActive = location.pathname === `${basePath}/dashboard` && currentHash === '#stats';

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
          <NavLink to={`${basePath}/dashboard`} end className={linkClassName(dashboardActive)}>
            INICIO
          </NavLink>
          <NavLink to={`${basePath}/team`} className={({ isActive }) => linkClassName(isActive)}>
            MI EQUIPO
          </NavLink>
          <NavLink to={`${basePath}/tournaments`} className={({ isActive }) => linkClassName(isActive)}>
            TORNEOS
          </NavLink>
          <NavLink to={`${basePath}/dashboard#matches`} className={linkClassName(matchesActive)}>
            PARTIDOS
          </NavLink>
          <NavLink to={`${basePath}/dashboard#stats`} className={linkClassName(statsActive)}>
            ESTADÍSTICAS
          </NavLink>
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
        <div className="tc-portal-role-chip">{roleLabel}</div>
      </section>

      <section className="tc-portal-content">{children}</section>
    </main>
  );
}
