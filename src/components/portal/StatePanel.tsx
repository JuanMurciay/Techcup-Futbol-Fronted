interface StatePanelProps {
  type: 'loading' | 'error' | 'empty';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatePanel({ type, message, actionLabel, onAction }: StatePanelProps) {
  return (
    <div className={`tc-state-panel tc-state-${type}`}>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
