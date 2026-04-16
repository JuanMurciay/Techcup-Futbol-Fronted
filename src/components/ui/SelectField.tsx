interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SelectField({
  label,
  value,
  options,
  placeholder = 'Selecciona una opción',
  onChange,
  error,
}: SelectFieldProps) {
  return (
    <label className="tc-field">
      <span className="tc-field-label">{label}</span>
      <select className="tc-input tc-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {options.length === 0 ? <span className="tc-field-empty">Sin opciones disponibles.</span> : null}
      {error ? <span className="tc-field-error">{error}</span> : null}
    </label>
  );
}
