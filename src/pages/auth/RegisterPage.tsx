import { Link } from 'react-router-dom';
import { useMemo, useState, type FormEvent } from 'react';
import TextField from '../../components/ui/TextField';
import SelectField from '../../components/ui/SelectField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import {
  AUTH_IMAGE_ASSETS,
  GENDER_OPTIONS,
  POSITION_OPTIONS,
  PROGRAM_OPTIONS,
  USER_TYPE_OPTIONS,
} from '../../features/auth/constants';
import { useRegister } from '../../hooks/useRegister';

export default function RegisterPage() {
  const { register, loading, error, success } = useRegister();
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    identification: '',
    email: '',
    password: '',
    passwordConfirm: '',
    age: '',
    userType: '',
    position: '',
    jerseyNumber: '',
    gender: '',
    program: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(
      form.name &&
        form.lastName &&
        form.identification &&
        form.email &&
        form.password &&
        form.passwordConfirm &&
        form.age &&
        form.userType &&
        form.position &&
        form.jerseyNumber &&
        form.gender &&
        form.program,
    );
  }, [form]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setValidationError('Debes completar todos los campos del formulario.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setValidationError('La confirmación de contraseña no coincide.');
      return;
    }
    if (Number(form.age) < 10) {
      setValidationError('La edad mínima válida es 10 años.');
      return;
    }
    setValidationError(null);

    await register({
      name: `${form.name.trim()} ${form.lastName.trim()}`,
      identification: form.identification.trim(),
      email: form.email.trim(),
      password: form.password,
      userType: form.userType === 'RELATIVE' ? 'PLAYER' : 'JUGADOR',
      jerseyNumber: Number(form.jerseyNumber),
      position: form.position,
      gender: form.gender,
      program: form.program,
      semester: 1,
      birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - Number(form.age)))
        .toISOString()
        .slice(0, 10),
    });
  };

  return (
    <main className="tc-register-page">
      <img className="tc-circuit-top" src={AUTH_IMAGE_ASSETS.circuitTop} alt="Decoración superior" />
      <img className="tc-circuit-bottom" src={AUTH_IMAGE_ASSETS.circuitBottom} alt="Decoración inferior" />
      <Link className="tc-back-link" to="/">
        ←
      </Link>
      <img
        src={AUTH_IMAGE_ASSETS.schoolShield}
        alt="Escudo TechCup"
        className="tc-shield-corner"
        onError={(e) => {
          e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
        }}
      />

      <h1 className="tc-register-title">CREA TU PERFIL</h1>
      <p className="tc-register-subtitle">Completa toda la información para unirte a TechCup</p>

      <form className="tc-register-form" onSubmit={onSubmit}>
        <section className="tc-register-column">
          <h2>INFORMACIÓN PERSONAL</h2>
          <TextField label="NOMBRE" value={form.name} onChange={(e) => setField('name', e.target.value)} />
          <TextField
            label="APELLIDOS"
            value={form.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
          />
          <TextField
            label="CORREO ELECTRONICO"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
          />
          <TextField
            label="CONTRASEÑA"
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
          />
          <TextField
            label="CONFIRMACIÓN CONTRASEÑA"
            type="password"
            value={form.passwordConfirm}
            onChange={(e) => setField('passwordConfirm', e.target.value)}
          />
          <div className="tc-inline-grid">
            <TextField label="EDAD" value={form.age} onChange={(e) => setField('age', e.target.value)} />
            <SelectField
              label="GÉNERO"
              value={form.gender}
              options={GENDER_OPTIONS}
              onChange={(value) => setField('gender', value)}
            />
          </div>
        </section>

        <section className="tc-register-column">
          <h2>INFORMACIÓN DEPORTIVA</h2>
          <SelectField
            label="TIPO DE USUARIO"
            value={form.userType}
            options={USER_TYPE_OPTIONS}
            onChange={(value) => setField('userType', value)}
          />
          <SelectField
            label="POSICIÓN"
            value={form.position}
            options={POSITION_OPTIONS}
            onChange={(value) => setField('position', value)}
          />
          <TextField
            label="N° DE CAMISETA"
            value={form.jerseyNumber}
            onChange={(e) => setField('jerseyNumber', e.target.value)}
          />

          <h2 className="tc-academic-title">INFORMACIÓN ACADÉMICA</h2>
          <TextField
            label="IDENTIFICACIÓN"
            value={form.identification}
            onChange={(e) => setField('identification', e.target.value)}
          />
          <SelectField
            label="PROGRAMA ACADÉMICO"
            value={form.program}
            options={PROGRAM_OPTIONS}
            onChange={(value) => setField('program', value)}
          />
        </section>

        <div className="tc-register-actions">
          {validationError ? <p className="tc-status-error">{validationError}</p> : null}
          {error ? <p className="tc-status-error">{error}</p> : null}
          {success ? <p className="tc-status-success">{success}</p> : null}
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
          </PrimaryButton>
        </div>
      </form>
    </main>
  );
}
