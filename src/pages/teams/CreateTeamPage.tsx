import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TeamService from '../../services/team.service';

const MAIN_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#111111'];
const SEC_COLORS  = ['#f59e0b', '#ffffff', '#ec4899', '#06b6d4', '#111111'];

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState(MAIN_COLORS[0]);
  const [secondaryColor, setSecondaryColor] = useState(SEC_COLORS[0]);
  const [shieldPreview, setShieldPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShieldUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setShieldPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('El nombre del equipo es requerido'); return; }
    setLoading(true); setError(null);
    try {
      const colors = `${primaryColor},${secondaryColor}`;
      await TeamService.create({ name, colors });
      navigate('/teams');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <Link to="/teams" style={s.backBtn}>←</Link>
        <div style={s.logoCorner}>
          <div style={s.logoBox}><span style={{ fontSize: 20 }}>⚽</span></div>
          <span style={s.logoText}>TECHCUP</span>
        </div>
      </header>

      <main style={s.main}>
        <h1 style={s.title}>CREA TU EQUIPO</h1>
        <p style={s.subtitle}>Personaliza cada detalle de tu equipo en TechCup</p>
        <hr style={s.divider} />

        {error && <div style={s.errorBox}>⚠️ {error}</div>}

        {/* Team name */}
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

        {/* Colors + shield row */}
        <div style={s.customRow}>
          {/* Uniform colors */}
          <div style={s.colorsSection}>
            <p style={s.sectionLabel}>Colores del uniforme</p>
            <div style={s.uniformPreview}>
              <div style={s.uniformCol}>
                <div style={{ ...s.uniformSwatch, backgroundColor: primaryColor }} />
                <span style={s.swatchLabel}>Local</span>
              </div>
              <div style={s.uniformCol}>
                <div style={{ ...s.uniformSwatch, backgroundColor: secondaryColor, border: secondaryColor === '#ffffff' ? '1px solid #ddd' : 'none' }} />
                <span style={s.swatchLabel}>Visitante</span>
              </div>
            </div>

            <div style={s.colorPicker}>
              <div style={s.colorRow}>
                <span style={s.colorRowLabel}>Color principal</span>
                {MAIN_COLORS.map((c) => (
                  <button
                    key={c}
                    style={{ ...s.colorDot, backgroundColor: c, outline: primaryColor === c ? '3px solid #3b82f6' : 'none', outlineOffset: 2 }}
                    onClick={() => setPrimaryColor(c)}
                  />
                ))}
              </div>
              <div style={s.colorRow}>
                <span style={s.colorRowLabel}>Color secundario</span>
                {SEC_COLORS.map((c) => (
                  <button
                    key={c}
                    style={{ ...s.colorDot, backgroundColor: c, border: c === '#ffffff' ? '1px solid #ddd' : 'none', outline: secondaryColor === c ? '3px solid #3b82f6' : 'none', outlineOffset: 2 }}
                    onClick={() => setSecondaryColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Shield upload */}
          <label style={s.shieldBox} htmlFor="shield-input">
            {shieldPreview ? (
              <img src={shieldPreview} alt="escudo" style={s.shieldImg} />
            ) : (
              <>
                <span style={{ fontSize: 28 }}>↑</span>
                <span style={s.shieldLabel}>Subir escudo del equipo</span>
              </>
            )}
            <input id="shield-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleShieldUpload} />
          </label>
        </div>

        <p style={s.shieldNote}>Escudo del equipo</p>

        <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creando...' : 'Continuar →'}
        </button>
      </main>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: "'Rajdhani','Segoe UI',sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 40px' },
  backBtn: { fontSize: 22, color: '#333', textDecoration: 'none', fontWeight: 700 },
  logoCorner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  logoBox: { width: 56, height: 56, border: '2px solid #3a6b35', borderRadius: 10, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 9, fontWeight: 800, color: '#3a6b35', letterSpacing: 2 },

  main: { maxWidth: 960, margin: '0 auto', padding: '0 40px 60px', display: 'flex', flexDirection: 'column', gap: 24 },
  title: { fontSize: 64, fontWeight: 900, letterSpacing: 6, color: '#111', fontFamily: "'Bebas Neue','Rajdhani',sans-serif", margin: 0, textAlign: 'center' },
  subtitle: { textAlign: 'center', fontSize: 13, color: '#666', marginTop: -12 },
  divider: { border: 'none', borderTop: '1px solid #ddd', margin: '0' },

  errorBox: { backgroundColor: '#fde8e8', color: '#c53030', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 600 },

  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 700, color: '#333' },
  nameInput: { backgroundColor: '#e8e8e0', border: '1px solid #d0d0c8', borderRadius: 8, padding: '12px 18px', fontSize: 14, fontFamily: 'inherit', outline: 'none', width: '60%' },
  hint: { fontSize: 11, color: '#999', margin: 0 },

  customRow: { display: 'flex', gap: 32, alignItems: 'flex-start' },
  colorsSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16 },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: '#333', margin: 0 },

  uniformPreview: { display: 'flex', gap: 12 },
  uniformCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  uniformSwatch: { width: 64, height: 64, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  swatchLabel: { fontSize: 11, color: '#555', fontWeight: 600 },

  colorPicker: { backgroundColor: '#f0f0e8', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 },
  colorRow: { display: 'flex', alignItems: 'center', gap: 12 },
  colorRowLabel: { fontSize: 11, color: '#777', width: 120, flexShrink: 0 },
  colorDot: { width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 },

  shieldBox: {
    width: 200, height: 200, border: '2px dashed #ccc', borderRadius: 16,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 10, cursor: 'pointer', backgroundColor: '#fff', flexShrink: 0,
  },
  shieldImg: { width: '100%', height: '100%', objectFit: 'contain', borderRadius: 14 },
  shieldLabel: { fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 1.4 },
  shieldNote: { fontSize: 13, color: '#333', fontWeight: 600, margin: 0 },

  submitBtn: {
    backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 8,
    padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, alignSelf: 'center',
    display: 'flex', alignItems: 'center', gap: 10,
  },
};