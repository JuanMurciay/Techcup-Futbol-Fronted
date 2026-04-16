import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { AUTH_IMAGE_ASSETS } from '../../features/auth/constants';

export default function HomePage() {
  return (
    <main className="tc-home-page" style={{ backgroundImage: `url(${AUTH_IMAGE_ASSETS.homeBackground})` }}>
      <header className="tc-home-header">
        <img
          src={AUTH_IMAGE_ASSETS.schoolShield}
          alt="Escudo TechCup"
          className="tc-home-shield"
          onError={(e) => {
            e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
          }}
        />
        <nav className="tc-home-nav">
          <span>INICIO</span>
          <span>NOTICIAS</span>
          <span>TORNEOS</span>
          <span>EQUIPOS</span>
        </nav>
        <Link to="/login" className="tc-login-link">
          INICIAR SESIÓN
        </Link>
      </header>

      <section className="tc-home-hero">
        <h1>TechCup Fútbol</h1>
        <h2>¿Listo para jugar?</h2>
        <p>Únete a un equipo o crea el tuyo y compite.</p>
        <Link to="/register">
          <PrimaryButton type="button">REGÍSTRATE</PrimaryButton>
        </Link>
      </section>

      <section className="tc-home-event-card">
        <div>
          <span>Sábado</span>
          <strong>18 de abril</strong>
        </div>
        <div>
          <span>Hora</span>
          <strong>9:00 a.m.</strong>
        </div>
        <div>
          <span>Lugar</span>
          <strong>Zona deportiva de la Escuela</strong>
        </div>
        <p>NO TE QUEDES POR FUERA</p>
      </section>

      <footer className="tc-home-footer">
        <div>
          <strong>SOPORTE</strong>
          <span>staff@escuelaing.edu.co</span>
        </div>
        <small>Desarrollado por JavaBurgers © 2026</small>
      </footer>
    </main>
  );
}
