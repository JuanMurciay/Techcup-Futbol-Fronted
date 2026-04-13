import { useState, useEffect, type ChangeEvent } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { savePendingTeamCreate } from '../../utils/pendingTeam';
import { AppLogo } from '../../components/AppLogo';

const MAIN_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#111111'];
const SEC_COLORS = ['#f59e0b', '#ffffff', '#ec4899', '#06b6d4', '#111111'];

export default function CaptainTeamOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; captainName?: string } | null;

  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState(MAIN_COLORS[0]);
  const [secondaryColor, setSecondaryColor] = useState(SEC_COLORS[0]);
  const [shieldPreview, setShieldPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.email) navigate('/register', { replace: true });
  }, [state?.email, navigate]);

  const handleShieldUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setShieldPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('El nombre del equipo es requerido');
      return;
    }
    setError(null);
    savePendingTeamCreate({ name: name.trim(), primaryColor, secondaryColor });
    navigate('/login', { replace: true, state: { captainOnboarding: true } });
  };

  if (!state?.email) return null;

  return (
    <div style={s.root}>
      <header style={s.header}>
        <div style={{ width: 32 }} />
        <div style={s.logoCorner}>
          <AppLogo height={56} />
        </div>
        <div style={{ width: 32 }} />
      </header>

      <main style={s.main}>
        <h1 style={s.title}>CREA TU EQUIPO</h1>
        <p style={s.subtitle}>Personaliza cada detalle de tu equipo en TechCup</p>
        <p style={s.captainHi}>
          Capitán: <strong>{state.captainName ?? state.email}</strong>
        </p>
        <hr style={s.divider} />

        {error && <div style={s.errorBox}>{error}</div>}

        <div style={s.section}>
          <label style={s.label}>Nombre de tu equipo</label>
          <input
            style={s.nameInput}
            placeholder="Ingresa el nombre de tu equipo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p style={s.hint}>Este nombre aparecerá en la tabla de posiciones y partidos</p>
        </div>

        <div style={s.customRow}>
          <div style={s.colorsSection}>
            <p style={s.sectionLabel}>Colores del uniforme</p>
            <div style={s.uniformPreview}>
              <div style={s.uniformCol}>
                <div style={{ ...s.uniformSwatch, backgroundColor: primaryColor }} />
                <span style={s.swatchLabel}>Local</span>
              </div>
              <div style={s.uniformCol}>
                <div
                  style={{
                    ...s.uniformSwatch,
                    backgroundColor: secondaryColor,
                    border: secondaryColor === '#ffffff' ? '1px solid #ddd' : 'none',
                  }}
                />
                <span style={s.swatchLabel}>Visitante</span>
              </div>
            </div>

            <div style={s.colorPicker}>
              <div style={s.colorRow}>
                <span style={s.colorRowLabel}>Color principal</span>
                {MAIN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={{
                      ...s.colorDot,
                      backgroundColor: c,
                      outline: primaryColor === c ? '3px solid #3b82f6' : 'none',
                      outlineOffset: 2,
                    }}
                    onClick={() => setPrimaryColor(c)}
                  />
                ))}
              </div>
              <div style={s.colorRow}>
                <span style={s.colorRowLabel}>Color secundario</span>
                {SEC_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={{
                      ...s.colorDot,
                      backgroundColor: c,
                      border: c === '#ffffff' ? '1px solid #ddd' : 'none',
                      outline: secondaryColor === c ? '3px solid #3b82f6' : 'none',
                      outlineOffset: 2,
                    }}
                    onClick={() => setSecondaryColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <label style={s.shieldBox} htmlFor="onb-shield-input">
            {shieldPreview ? (
              <img src={shieldPreview} alt="" style={s.shieldImg} />
            ) : (
              <>
                <span style={{ fontSize: 28 }}>{'\u{1F4E4}'}</span>
                <span style={s.shieldLabel}>Subir escudo del equipo</span>
              </>
            )}
            <input id="onb-shield-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleShieldUpload} />
          </label>
        </div>

        <button type="button" style={s.submitBtn} onClick={handleSubmit}>
          Continuar {'\u2192'}
        </button>
        <p style={s.noteLogin}>Después de continuar iniciarás sesión para guardar tu equipo en TechCup.</p>
      </main>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#fafaf8', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 40px' },
  logoCorner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  main: { maxWidth: 960, margin: '0 auto', padding: '0 40px 60px', display: 'flex', flexDirection: 'column', gap: 20 },
  title: {
    fontSize: 56,
    fontWeight: 900,
    letterSpacing: 4,
    color: '#111',
    fontFamily: "'Bebas Neue','Rajdhani',sans-serif",
    margin: 0,
    textAlign: 'center',
  },
  subtitle: { textAlign: 'center', fontSize: 14, color: '#666', margin: 0 },
  captainHi: { textAlign: 'center', fontSize: 13, color: '#444', margin: 0 },
  divider: { border: 'none', borderTop: '1px solid #ddd', margin: '8px 0 0' },
  errorBox: { backgroundColor: '#fde8e8', color: '#c53030', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 600 },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 14, fontWeight: 700, color: '#333' },
  nameInput: {
    backgroundColor: '#e8e8e0',
    border: '1px solid #d0d0c8',
    borderRadius: 8,
    padding: '14px 18px',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    maxWidth: 560,
    width: '100%',
    boxSizing: 'border-box',
  },
  hint: { fontSize: 12, color: '#999', margin: 0 },
  customRow: { display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' },
  colorsSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 },
  sectionLabel: { fontSize: 14, fontWeight: 700, color: '#333', margin: 0 },
  uniformPreview: { display: 'flex', gap: 16 },
  uniformCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  uniformSwatch: { width: 72, height: 72, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  swatchLabel: { fontSize: 12, color: '#555', fontWeight: 600 },
  colorPicker: { backgroundColor: '#f0f0e8', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 },
  colorRow: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  colorRowLabel: { fontSize: 12, color: '#555', width: 120, flexShrink: 0, fontWeight: 600 },
  colorDot: { width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 },
  shieldBox: {
    width: 220,
    height: 220,
    border: '2px dashed #ccc',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
    backgroundColor: '#fff',
    flexShrink: 0,
  },
  shieldImg: { width: '100%', height: '100%', objectFit: 'contain', borderRadius: 14, padding: 8, boxSizing: 'border-box' },
  shieldLabel: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 1.4, padding: '0 12px' },
  submitBtn: {
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '18px 48px',
    fontSize: 17,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: "'Rajdhani',sans-serif",
    letterSpacing: 1,
    alignSelf: 'center',
    marginTop: 8,
  },
  noteLogin: { textAlign: 'center', fontSize: 12, color: '#888', margin: 0 },
};
