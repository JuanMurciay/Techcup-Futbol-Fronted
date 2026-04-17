import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';
import PlayerService from '../../services/player.service';
import TeamService from '../../services/team.service';
import type { ProfileDTO } from '../../types';

const TEAM_ID_KEY = 'tc_captain_team_id';

export default function CaptainCreateTeamPage() {
  const navigate = useNavigate();
  const { loading, error, player, refresh } = usePlayerPortalData();
  const [teamName, setTeamName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2bb61e');
  const [secondaryColor, setSecondaryColor] = useState('#9c6cb8');
  const [invitePlayerId, setInvitePlayerId] = useState<number | ''>('');
  const [availablePlayers, setAvailablePlayers] = useState<ProfileDTO[]>([]);
  const [shieldFile, setShieldFile] = useState<File | null>(null);
  const [createdTeamId, setCreatedTeamId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void PlayerService.getAvailable()
      .then((players) => setAvailablePlayers(players))
      .catch(() => setAvailablePlayers([]));
  }, []);

  const currentTeamId = createdTeamId ?? player?.teamId ?? null;

  const createTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teamName.trim()) {
      setErrorMessage('Debes ingresar el nombre del equipo.');
      return;
    }
    setCreating(true);
    setErrorMessage(null);
    setStatus(null);
    try {
      await TeamService.create({
        name: teamName.trim(),
        colors: `${primaryColor},${secondaryColor}`,
      });
      const teams = await TeamService.getAll();
      const matchByName = [...teams].reverse().find((team) => team.name.toLowerCase() === teamName.trim().toLowerCase());
      if (!matchByName) {
        throw new Error('El equipo se creó, pero no fue posible recuperar su ID.');
      }
      if (shieldFile) {
        const localShieldUrl = URL.createObjectURL(shieldFile);
        await TeamService.updateShield(matchByName.id, localShieldUrl);
      }
      localStorage.setItem(TEAM_ID_KEY, String(matchByName.id));
      setCreatedTeamId(matchByName.id);
      setStatus('Equipo creado correctamente. Ya puedes invitar jugadores y continuar con el pago.');
      refresh();
    } catch (creationError) {
      setErrorMessage(creationError instanceof Error ? creationError.message : 'No se pudo crear el equipo.');
    } finally {
      setCreating(false);
    }
  };

  const invitePlayer = async () => {
    if (!currentTeamId || !invitePlayerId) return;
    setInviting(true);
    setErrorMessage(null);
    setStatus(null);
    try {
      await TeamService.sendInvitation(currentTeamId, invitePlayerId);
      setStatus('Invitación enviada correctamente.');
      setInvitePlayerId('');
    } catch (inviteError) {
      setErrorMessage(inviteError instanceof Error ? inviteError.message : 'No se pudo enviar la invitación.');
    } finally {
      setInviting(false);
    }
  };

  const onShieldFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setShieldFile(file);
  };

  return (
    <PortalShell title="¡Bienvenido Capitán!" roleLabel="CAPITÁN" basePath="/captain" player={player}>
      {loading ? <StatePanel type="loading" message="Cargando información del capitán..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}

      {!loading && !error ? (
        <div className="tc-captain-two-col">
          <article className="tc-portal-card">
            <h2>VAMOS A CREAR TU EQUIPO</h2>
            <p className="tc-captain-copy">
              Recuerda que debes estar mínimo 7 jugadores y máximo 12 jugadores inscritos en el equipo.
            </p>

            <form className="tc-captain-form" onSubmit={createTeam}>
              <label className="tc-field">
                <span className="tc-field-label">NOMBRE DEL EQUIPO</span>
                <input className="tc-input" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Ingresa el nombre del equipo" />
              </label>
              <div className="tc-color-row">
                <label className="tc-field">
                  <span className="tc-field-label">COLOR PRIMARIO</span>
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                </label>
                <label className="tc-field">
                  <span className="tc-field-label">COLOR SECUNDARIO</span>
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                </label>
              </div>
              <label className="tc-field">
                <span className="tc-field-label">SUBIR ESCUDO DEL EQUIPO</span>
                <input className="tc-input-file" type="file" accept="image/*" onChange={onShieldFile} />
              </label>
              <button className="tc-btn-green tc-btn-small" type="submit" disabled={creating}>
                {creating ? 'CREANDO...' : 'CREAR EQUIPO'}
              </button>
            </form>

            <div className="tc-captain-invite">
              <h3>INVITAR JUGADORES DISPONIBLES</h3>
              <select value={invitePlayerId} onChange={(e) => setInvitePlayerId(e.target.value ? Number(e.target.value) : '')} className="tc-input">
                <option value="">Selecciona un jugador</option>
                {availablePlayers.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.fullName} - {candidate.email}
                  </option>
                ))}
              </select>
              <button type="button" className="tc-btn-green tc-btn-small" onClick={invitePlayer} disabled={!currentTeamId || !invitePlayerId || inviting}>
                {inviting ? 'ENVIANDO...' : 'AÑADIR'}
              </button>
            </div>

            {errorMessage ? <p className="tc-status-error">{errorMessage}</p> : null}
            {status ? <p className="tc-status-success">{status}</p> : null}
          </article>

          <article className="tc-portal-card tc-captain-side-panel">
            <h2>PASO SIGUIENTE</h2>
            <p>Después de crear el equipo y enviar invitaciones, debes cargar el comprobante para validar la inscripción.</p>
            <button
              className="tc-btn-primary tc-captain-next-btn"
              type="button"
              disabled={!currentTeamId}
              onClick={() => navigate('/captain/payment')}
            >
              CONTINUAR
            </button>
          </article>
        </div>
      ) : null}
    </PortalShell>
  );
}
