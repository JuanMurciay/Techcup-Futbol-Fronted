import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setLoading(true); setError(null);
    try {
      const data = await AuthService.login({ email, password });
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role: string = payload.role ?? payload.authorities?.[0]?.replace('ROLE_', '') ?? 'JUGADOR';
      const authUser = { email: data.email, role, token: data.token };
      localStorage.setItem('tc_user', JSON.stringify(authUser));
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'ORGANIZADOR') navigate('/organizer/dashboard');
      else navigate('/standings');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.left}>
        {/* Circuit decoration */}
        <div style={s.circuitTopLeft} />

        {/* Logo top right inside left panel */}
        <div style={s.logoCorner}>
          <div style={s.logoBox}><span style={{ fontSize: 22 }}>⚽</span></div>
          <span style={s.logoText}>TECHCUP</span>
        </div>

        <h1 style={s.title}>INICIO DE SESIÓN</h1>

        <div style={s.form}>
          {/* Email */}
          <div style={s.field}>
            <label style={s.label}>@ CORREO ELECTRÓNICO</label>
            <input
              style={{ ...s.input, ...(error ? s.inputError : {}) }}
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>🔒 CONTRASEÑA</label>
            <input
              style={{ ...s.input, ...(error ? s.inputError : {}) }}
              type="password"
              placeholder="••••••••••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Options row */}
          <div style={s.optionsRow}>
            <label style={s.checkLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Recordarme
            </label>
            <a href="#" style={s.forgotLink}>¿Olvidaste tu contraseña?</a>
          </div>

          {/* Error */}
          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          {/* Submit */}
          <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          {/* Register link */}
          <p style={s.registerRow}>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={s.registerLink}>CREAR PERFIL</Link>
          </p>

          {/* Divider */}
          <div style={s.divider}><span style={s.dividerText}>O DESEAS CONTINUAR</span></div>

          {/* Google */}
          <button style={s.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.5 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.6 35.5 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.4 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.6 4.7-4.8 6.1l6.2 5.2C40.9 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Google
          </button>
        </div>

        {/* Circuit decoration bottom */}
        <div style={s.circuitBottomRight} />
      </div>

      {/* Right panel – goalkeeper image placeholder */}
      <div style={s.right}>
        <div style={s.imagePlaceholder}>
          <span style={{ fontSize: 80 }}>🧤</span>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 16 }}>TechCup</p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },

  left: {
    flex: 1, backgroundColor: '#f0f0e8', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '40px 60px', position: 'relative', overflow: 'hidden',
  },
  right: {
    width: '48%', background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 50%, #1a4a2a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  imagePlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center' },

  circuitTopLeft: {
    position: 'absolute', top: 20, left: 20, width: 180, height: 180,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23ccc' stroke-width='1.5'/%3E%3Ccircle cx='40' cy='40' r='4' fill='%23ccc'/%3E%3Cline x1='60' y1='40' x2='180' y2='40' stroke='%23ccc' stroke-width='1'/%3E%3Cline x1='40' y1='60' x2='40' y2='180' stroke='%23ccc' stroke-width='1'/%3E%3Crect x='130' y='30' width='16' height='16' fill='none' stroke='%23ccc' stroke-width='1.5'/%3E%3Crect x='30' y='130' width='16' height='16' fill='none' stroke='%23ccc' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
  circuitBottomRight: {
    position: 'absolute', bottom: 20, right: 20, width: 140, height: 100,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='100'%3E%3Cline x1='0' y1='50' x2='140' y2='50' stroke='%23ccc' stroke-width='1'/%3E%3Ccircle cx='70' cy='50' r='6' fill='none' stroke='%23ccc' stroke-width='1.5'/%3E%3Cline x1='70' y1='44' x2='70' y2='0' stroke='%23ccc' stroke-width='1'/%3E%3Crect x='60' y='60' width='20' height='12' fill='none' stroke='%23ccc' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },

  logoCorner: {
    position: 'absolute', top: 16, right: 16,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  logoBox: {
    width: 56, height: 56, border: '2px solid #3a6b35', borderRadius: 10,
    backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 9, fontWeight: 800, color: '#3a6b35', letterSpacing: 2 },

  title: {
    fontSize: 38, fontWeight: 900, letterSpacing: 4, color: '#111',
    fontFamily: "'Bebas Neue','Rajdhani',sans-serif", marginBottom: 32,
    display: 'flex', alignItems: 'center', gap: 12,
  },

  form: { display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 440 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, fontWeight: 800, color: '#333', letterSpacing: 1 },
  input: {
    backgroundColor: '#e8e8e0', border: '1.5px solid transparent', borderRadius: 8,
    padding: '12px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.15s',
  },
  inputError: { borderColor: '#ef4444' },

  optionsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  checkLabel: { display: 'flex', alignItems: 'center', fontSize: 12, color: '#555', cursor: 'pointer' },
  forgotLink: { fontSize: 12, color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 },

  errorBox: {
    backgroundColor: '#fde8e8', color: '#c53030', borderRadius: 8,
    padding: '10px 14px', fontSize: 12, fontWeight: 600,
  },

  submitBtn: {
    backgroundColor: '#3a6b35', color: '#fff', border: 'none', borderRadius: 8,
    padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, transition: 'background 0.15s',
  },

  registerRow: { textAlign: 'center', fontSize: 13, color: '#555' },
  registerLink: { color: '#8b5cf6', fontWeight: 800, textDecoration: 'none', letterSpacing: 0.5 },

  divider: { display: 'flex', alignItems: 'center', gap: 12 },
  dividerText: {
    fontSize: 11, color: '#999', letterSpacing: 1, whiteSpace: 'nowrap',
    margin: '0 auto', padding: '0 12px', position: 'relative',
  },

  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', border: '1.5px solid #ddd', borderRadius: 8,
    padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', gap: 4, transition: 'box-shadow 0.15s',
  },
};