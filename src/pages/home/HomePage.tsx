import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>TechCup Fútbol</h1>
      <p>Pantalla inicial (pendiente maquetación según mockup).</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/register">Registrarse</Link>
        <Link to="/login">Iniciar sesión</Link>
      </div>
    </main>
  );
}
