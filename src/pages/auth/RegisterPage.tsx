import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlayerService from '../../services/player.service';
import { AppLogo } from '../../components/AppLogo';

type UserType = 'JUGADOR' | 'ARBITRO' | 'CAPITAN';
type Position = 'Portero' | 'Defensa' | 'Volante' | 'Delantero';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [identification, setIdentification] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [userType, setUserType] = useState<UserType>('JUGADOR');
  const [position, setPosition] = useState<Position>('Portero');
  const [jerseyNumber, setJerseyNumber] = useState(10);
  const [gender, setGender] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const showPlayerFields = userType === 'JUGADOR' || userType === 'CAPITAN';

  const validate = () => {
    if (!name.trim()) return 'El nombre es requerido';
    if (!identification.trim()) return 'La identificación es requerida';
    if (!email.trim()) return 'El correo es requerido';
    if (password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    if (showPlayerFields && !birthDate.trim()) return 'La fecha de nacimiento es requerida';
    if (showPlayerFields && (jerseyNumber < 1 || jerseyNumber > 99)) return 'Dorsal debe estar entre 1 y 99';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true); setError(null);
    try {
      await PlayerService.register({
        name,
        identification,
        email,
        password,
        userType,
        jerseyNumber,
        position,
        gender,
        birthDate: birthDate || undefined,
      });
      if (userType === 'CAPITAN') {
        navigate('/register/create-team', {
          replace: true,
          state: { email: email.trim(), captainName: name.trim() },
        });
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.circuitTop} />

      <header style={s.header}>
        <a href="/login" style={s.backBtn}>Volver</a>
        <div style={s.logoCorner}>
          <AppLogo height={72} />
        </div>
      </header>

      <main style={s.main}>
        <h1 style={s.title}>CREA TU PERFIL</h1>
        <p style={s.subtitle}>Completa toda la información para unirte a TechCup</p>

        {success && (
          <div style={s.successBox}>Perfil creado correctamente. Redirigiendo al login...</div>
        )}
        {error && <div style={s.errorBox}>{error}</div>}

        <div style={s.formGrid}>
          <div style={s.photoCol}>
            <div style={s.photoCircle}>
              <span style={s.photoPlus}>+</span>
              <span style={s.photoLabel}>SUBIR IMAGEN DE PERFIL</span>
            </div>
          </div>

          <div style={s.fieldsCol}>
            <Field label="NOMBRE COMPLETO">
              <input style={s.input} placeholder="Ingresa tu nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="CORREO ELECTRÓNICO">
              <input style={s.input} type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="CONTRASEÑA">
              <input style={s.input} type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
          </div>

          <div style={s.fieldsCol}>
            <Field label="IDENTIFICACIÓN">
              <input style={s.input} placeholder="Número de identificación" value={identification} onChange={(e) => setIdentification(e.target.value)} />
            </Field>
            <Field label="FECHA DE NACIMIENTO">
              <input style={s.input} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </Field>
            <Field label="CONFIRMACIÓN CONTRASEÑA">
              <input style={s.input} type="password" placeholder="••••••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Field>
          </div>
        </div>

        <div style={s.roleSection}>
          <div style={s.roleSelect}>
            <p style={s.roleTitle}>¿CÓMO DESEAS REGISTRARTE?</p>
            <div style={s.roleBtns}>
              {(['JUGADOR', 'ARBITRO', 'CAPITAN'] as UserType[]).map((r) => (
                <button
                  key={r}
                  style={{ ...s.roleBtn, ...(userType === r ? s.roleBtnActive : {}) }}
                  onClick={() => setUserType(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {showPlayerFields && (
            <div style={s.playerFields}>
              <p style={s.roleTitle}>
                HAZ SELECCIONADO <span style={{ color: '#22c55e' }}>{userType}</span>
              </p>
              <div style={s.playerFieldsRow}>
                <Field label="POSICIÓN">
                  <select style={s.input} value={position} onChange={(e) => setPosition(e.target.value as Position)}>
                    {['Portero', 'Defensa', 'Volante', 'Delantero'].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="N° DE CAMISA">
                  <input
                    style={s.input} type="number" min={1} max={99}
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(parseInt(e.target.value) || 1)}
                  />
                </Field>
              </div>
              {userType === 'CAPITAN' && (
                <div style={s.createTeamHint}>
                  <span style={s.createTeamBtn}>CREAR EQUIPO</span>
                  <span style={{ fontSize: 11, color: '#888' }}>Podrás crear tu equipo después del registro</span>
                </div>
              )}
            </div>
          )}
        </div>

        <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'CREANDO PERFIL...' : 'CREAR PERFIL DEPORTIVO'}
        </button>

        <p style={s.loginRow}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={s.loginLink}>INICIAR SESIÓN</Link>
        </p>
      </main>

      <div style={s.circuitBottom} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 800, color: '#333', letterSpacing: 1 }}>{label}</label>
      {children}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#f0f0e8', fontFamily: "'Rajdhani','Segoe UI',sans-serif", position: 'relative', paddingBottom: 40 },
  circuitTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 8,
    background: 'linear-gradient(90deg, #3a6b35 0%, #22c55e 50%, #3a6b35 100%)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 40px 0' },
  backBtn: { fontSize: 16, color: '#333', textDecoration: 'none', fontWeight: 700 },
  logoCorner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },

  main: { maxWidth: 860, margin: '0 auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24 },
  title: { fontSize: 52, fontWeight: 900, letterSpacing: 6, color: '#111', fontFamily: "'Bebas Neue','Rajdhani',sans-serif", textAlign: 'center', margin: 0 },
  subtitle: { textAlign: 'center', fontSize: 13, color: '#666', marginTop: -8 },

  successBox: { backgroundColor: '#f0fdf4', color: '#166534', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 600 },
  errorBox: { backgroundColor: '#fde8e8', color: '#c53030', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 600 },

  formGrid: { display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: 24, alignItems: 'start' },
  photoCol: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  photoCircle: { width: 120, height: 120, borderRadius: '50%', backgroundColor: '#3a6b35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#fff', cursor: 'pointer' },
  photoPlus: { fontSize: 36, fontWeight: 300, lineHeight: 1 },
  photoLabel: { fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.3 },
  fieldsCol: { display: 'flex', flexDirection: 'column', gap: 14 },

  input: { backgroundColor: '#e4e4dc', border: '1.5px solid transparent', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' },

  roleSection: { display: 'flex', gap: 24, backgroundColor: '#e8e8e0', borderRadius: 12, padding: '20px 24px' },
  roleSelect: { display: 'flex', flexDirection: 'column', gap: 12 },
  roleTitle: { fontSize: 11, fontWeight: 800, color: '#333', letterSpacing: 1, margin: 0 },
  roleBtns: { display: 'flex', flexDirection: 'column', gap: 8 },
  roleBtn: { border: '1.5px solid #ccc', borderRadius: 6, padding: '8px 24px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', backgroundColor: 'transparent', color: '#555', letterSpacing: 1 },
  roleBtnActive: { backgroundColor: '#3a6b35', borderColor: '#3a6b35', color: '#fff' },
  playerFields: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  playerFieldsRow: { display: 'flex', gap: 16 },
  createTeamHint: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 },
  createTeamBtn: { backgroundColor: '#d4b8ff', color: '#6b21a8', borderRadius: 8, padding: '6px 16px', fontSize: 11, fontWeight: 800, letterSpacing: 0.5 },

  submitBtn: { backgroundColor: '#3a6b35', color: '#fff', border: 'none', borderRadius: 8, padding: '16px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2 },
  loginRow: { textAlign: 'center', fontSize: 13, color: '#555' },
  loginLink: { color: '#8b5cf6', fontWeight: 800, textDecoration: 'none' },

  circuitBottom: { position: 'absolute', bottom: 0, right: 40, width: 160, height: 80, opacity: 0.3 },
};
