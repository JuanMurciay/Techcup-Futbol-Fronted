import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import StatePanel from '../../components/portal/StatePanel';
import { usePlayerPortalData } from '../../hooks/usePlayerPortalData';
import PaymentService, { type Payment } from '../../services/payment.service';

const TEAM_ID_KEY = 'tc_captain_team_id';

export default function CaptainPaymentPage() {
  const navigate = useNavigate();
  const { loading, error, player, refresh } = usePlayerPortalData();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const teamId = useMemo(() => {
    if (player?.teamId) return player.teamId;
    const fromStorage = localStorage.getItem(TEAM_ID_KEY);
    return fromStorage ? Number(fromStorage) : null;
  }, [player?.teamId]);

  useEffect(() => {
    const loadPayment = async () => {
      if (!teamId) return;
      try {
        const teamPayment = await PaymentService.getByTeam(teamId);
        setPayment(teamPayment);
      } catch {
        setPayment(null);
      }
    };
    void loadPayment();
  }, [teamId]);

  const submitPayment = async () => {
    if (!teamId || !receiptFile) return;
    setUploading(true);
    setStatusError(null);
    setStatusMessage(null);
    try {
      const uploadedPayment = await PaymentService.uploadReceipt(teamId, receiptFile);
      if (uploadedPayment?.id) {
        await PaymentService.sendToReview(uploadedPayment.id);
      }
      const refreshed = await PaymentService.getByTeam(teamId);
      setPayment(refreshed);
      setStatusMessage('Comprobante subido correctamente. El pago está en revisión.');
      refresh();
    } catch (submitError) {
      setStatusError(submitError instanceof Error ? submitError.message : 'No se pudo procesar el pago.');
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setReceiptFile(file);
  };

  const normalizedStatus = (payment?.status ?? 'PENDIENTE').toUpperCase();
  const approved = normalizedStatus.includes('APROB');

  return (
    <PortalShell title="Realizar pago" roleLabel="CAPITÁN" basePath="/captain" player={player}>
      {loading ? <StatePanel type="loading" message="Cargando datos de pago..." /> : null}
      {error ? <StatePanel type="error" message={error} actionLabel="Reintentar" onAction={refresh} /> : null}
      {!loading && !error ? (
        <div className="tc-captain-two-col">
          <article className="tc-portal-card">
            <h2>INFORMACIÓN DEL PAGO</h2>
            <p className="tc-captain-copy">
              Para continuar con el equipo debes realizar el pago y subir un comprobante en formato PNG, JPG o PDF.
            </p>
            <div className="tc-payment-upload-box">
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={onFileChange} />
            </div>
            <div className={`tc-payment-status-pill ${approved ? 'approved' : 'processing'}`}>
              {approved ? '¡APROBADO!' : 'EN PROCESO...'}
            </div>
            <button className="tc-btn-green tc-btn-small" type="button" disabled={!receiptFile || uploading || !teamId} onClick={submitPayment}>
              {uploading ? 'SUBIENDO...' : 'SUBIR COMPROBANTE'}
            </button>
            {statusError ? <p className="tc-status-error">{statusError}</p> : null}
            {statusMessage ? <p className="tc-status-success">{statusMessage}</p> : null}
          </article>

          <article className="tc-portal-card tc-captain-side-panel">
            <h2>ESTADO ACTUAL</h2>
            <p>
              Equipo: <strong>{teamId ?? 'Sin equipo'}</strong>
            </p>
            <p>
              Estado de pago: <strong>{normalizedStatus}</strong>
            </p>
            <button className="tc-btn-primary tc-captain-next-btn" type="button" disabled={!approved} onClick={() => navigate('/captain/team')}>
              FINALIZAR
            </button>
          </article>
        </div>
      ) : null}
    </PortalShell>
  );
}
