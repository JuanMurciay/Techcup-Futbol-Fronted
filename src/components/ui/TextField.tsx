import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function TextField({ label, error, id, ...props }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="tc-field">
      <span className="tc-field-label">{label}</span>
      <input id={inputId} className="tc-input" {...props} />
      {error ? <span className="tc-field-error">{error}</span> : null}
    </label>
  );
}
