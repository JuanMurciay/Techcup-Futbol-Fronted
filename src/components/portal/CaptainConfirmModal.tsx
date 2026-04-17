interface CaptainConfirmModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CaptainConfirmModal({
  open,
  title,
  onCancel,
  onConfirm,
}: CaptainConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="tc-modal-overlay" role="presentation">
      <div className="tc-modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        <div className="tc-modal-actions">
          <button type="button" onClick={onCancel}>
            VOLVER
          </button>
          <button type="button" className="tc-btn-confirm" onClick={onConfirm}>
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
}
