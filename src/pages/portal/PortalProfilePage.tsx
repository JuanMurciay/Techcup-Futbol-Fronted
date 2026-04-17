import PortalShell from '../../components/portal/PortalShell';
import SelectField from '../../components/ui/SelectField';
import TextField from '../../components/ui/TextField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';
import { useProfileEditor } from '../../hooks/useProfileEditor';
import { AUTH_IMAGE_ASSETS } from '../../features/auth/constants';

interface PortalProfilePageProps {
  mode: 'player' | 'captain';
}

const POSITION_OPTIONS = ['Portero', 'Defensa', 'Volante', 'Delantero'] as const;

export default function PortalProfilePage({ mode }: PortalProfilePageProps) {
  const { loading, error, player, refresh } = usePlayerPortalData();
  const editor = useProfileEditor(player, refresh);

  const basePath = mode === 'captain' ? '/captain' : '/player';
  const roleLabel = mode === 'captain' ? 'CAPITÁN' : 'JUGADOR';

  return (
    <PortalShell title="Perfil" roleLabel={roleLabel} basePath={basePath} player={player}>
      {loading ? <StatePanel type="loading" message="Cargando perfil..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}

      {!loading && !error && player ? (
        <div className="tc-profile-layout">
          <article className="tc-portal-card">
            <div className="tc-profile-avatar-wrap">
              <img
                src={AUTH_IMAGE_ASSETS.playerAvatar}
                alt="Avatar del jugador"
                onError={(e) => {
                  e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
                }}
              />
            </div>
            <h2>DATOS DEL JUGADOR</h2>
            <div className="tc-profile-grid">
              <TextField
                label="NOMBRE COMPLETO"
                value={editor.values.fullName}
                onChange={(e) => editor.setField('fullName', e.target.value)}
                error={editor.errors.fullName}
              />
              <TextField
                label="CORREO ELECTRÓNICO"
                value={editor.values.email}
                onChange={(e) => editor.setField('email', e.target.value)}
                error={editor.errors.email}
              />
              <TextField label="GÉNERO" value={player.gender ?? 'N/D'} readOnly />
              <TextField label="IDENTIFICACIÓN" value={player.identification ?? 'N/D'} readOnly />
              <TextField label="PROGRAMA ACADÉMICO" value={player.program ?? 'N/D'} readOnly />
            </div>
          </article>

          <article className="tc-portal-card">
            <div className="tc-jersey-row">
              <img
                src={AUTH_IMAGE_ASSETS.jerseyFront}
                alt="Camiseta frontal"
                onError={(e) => {
                  e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
                }}
              />
              <img
                src={AUTH_IMAGE_ASSETS.jerseyBack}
                alt="Camiseta trasera"
                onError={(e) => {
                  e.currentTarget.src = AUTH_IMAGE_ASSETS.techcupLogo;
                }}
              />
            </div>
            <h2>PERFIL DEPORTIVO</h2>
            <div className="tc-profile-grid">
              <TextField label="TIPO DE USUARIO" value={player.userType ?? 'STUDENT'} readOnly />
              <SelectField
                label="POSICIÓN"
                options={POSITION_OPTIONS}
                value={editor.values.position}
                onChange={(value) => editor.setField('position', value)}
                error={editor.errors.position}
              />
              <TextField
                label="NÚMERO DE CAMISETA"
                value={editor.values.jerseyNumber}
                onChange={(e) => editor.setField('jerseyNumber', e.target.value)}
                error={editor.errors.jerseyNumber}
              />
            </div>

            {editor.error ? <p className="tc-status-error">{editor.error}</p> : null}
            {editor.success ? <p className="tc-status-success">{editor.success}</p> : null}

            <div className="tc-profile-save">
              <PrimaryButton type="button" onClick={editor.save} disabled={editor.loading}>
                {editor.loading ? 'GUARDANDO...' : 'GUARDAR'}
              </PrimaryButton>
            </div>
          </article>
        </div>
      ) : null}
    </PortalShell>
  );
}
