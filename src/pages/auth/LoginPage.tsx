import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import TextField from '../../components/ui/TextField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import GoogleGIcon from '../../components/ui/GoogleGIcon';
import LoginRadarDecor from '../../components/auth/LoginRadarDecor';
import { AUTH_IMAGE_ASSETS } from '../../features/auth/constants';
import { useAuth } from '../../hooks/useAuth';
import { redirectToGoogleLogin } from '../../utils/googleOAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
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
        <div className="tc-login-circuits" aria-hidden>
          <img className="tc-circuit-top" src={AUTH_IMAGE_ASSETS.circuitTop} alt="" />
          <img className="tc-circuit-bottom" src={AUTH_IMAGE_ASSETS.circuitBottom} alt="" />
          <LoginRadarDecor />
        </div>

        <Link className="tc-back-link tc-login-back" to="/" aria-label="Volver al inicio">
          ←
        </Link>

        <div className="tc-login-left-inner">
          <h1 className="tc-auth-title tc-login-title">INICIO DE SESIÓN</h1>

          <form className="tc-login-form" onSubmit={onSubmit}>
            <div className="tc-auth-card tc-login-form-card">
              <TextField
                label="@ CORREO ELECTRÓNICO"
                placeholder="correo@mail.escuelaing.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="🔒 CONTRASEÑA"
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="tc-login-card-meta">
                <label className="tc-remember-check">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Recordarme
                </label>
                <button type="button" className="tc-forgot-password-link">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
            {fieldError ? <p className="tc-status-error tc-login-form-errors">{fieldError}</p> : null}
            {error ? <p className="tc-status-error tc-login-form-errors">{error}</p> : null}
            <div className="tc-login-primary-wrap">
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
              </PrimaryButton>
            </div>
          </form>
          <p className="tc-inline-help tc-login-register-link">
            ¿No tienes una cuenta? <Link to="/register">REGÍSTRATE</Link>
          </p>
          <div className="tc-login-google-block">
            <p className="tc-login-divider">O DESEAS CONTINUAR</p>
            <button
              type="button"
              className="tc-google-login-btn"
              aria-label="Iniciar sesión con Google"
              onClick={() => redirectToGoogleLogin()}
            >
              <GoogleGIcon className="tc-google-login-btn-icon" />
              <span>Google</span>
            </button>
          </div>
        </div>
      </section>

      <section className="tc-login-right">
        <div className="tc-login-hero-wrap">
          <img src={AUTH_IMAGE_ASSETS.loginBackground} alt="Portero TechCup" className="tc-login-hero" />
          <div className="tc-login-right-brand">
            <img
              src={AUTH_IMAGE_ASSETS.schoolShield}
              alt=""
              className="tc-login-brand-mark"
              onError={(e) => {
                e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
              }}
            />
            <span className="tc-login-right-logo-text">TECHCUP</span>
          </div>
        </div>
      </section>
    </main>
  );
}
