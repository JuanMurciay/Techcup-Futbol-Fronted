import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import TextField from '../../components/ui/TextField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { AUTH_IMAGE_ASSETS } from '../../features/auth/constants';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFieldError('Correo y contraseña son obligatorios.');
      return;
    }
    setFieldError(null);
    await login(email.trim(), password);
  };

  return (
    <main className="tc-login-page">
      <section className="tc-login-left">
        <img className="tc-circuit-top" src={AUTH_IMAGE_ASSETS.circuitTop} alt="Decoración superior" />
        <img className="tc-circuit-bottom tc-login-circuit-bottom" src={AUTH_IMAGE_ASSETS.circuitBottom} alt="" />
        <Link className="tc-back-link" to="/">
          ←
        </Link>
        <h1 className="tc-auth-title">INICIO DE SESIÓN</h1>

        <form className="tc-auth-card" onSubmit={onSubmit}>
          <TextField
            label="CORREO ELECTRONICO"
            placeholder="correo@mail.escuelaing.edu.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="CONTRASEÑA"
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldError ? <p className="tc-status-error">{fieldError}</p> : null}
          {error ? <p className="tc-status-error">{error}</p> : null}
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
          </PrimaryButton>
          <p className="tc-inline-help">
            ¿No tienes una cuenta? <Link to="/register">REGÍSTRATE</Link>
          </p>
        </form>
      </section>

      <section className="tc-login-right">
        <img
          src={AUTH_IMAGE_ASSETS.schoolShield}
          alt="Escudo TechCup"
          className="tc-shield-corner"
          onError={(e) => {
            e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
          }}
        />
        <img src={AUTH_IMAGE_ASSETS.loginBackground} alt="Portero TechCup" className="tc-login-hero" />
      </section>
    </main>
  );
}
