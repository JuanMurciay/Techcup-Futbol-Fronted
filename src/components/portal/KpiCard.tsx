interface KpiCardProps {
  label: string;
  value: string | number;
  accent?: 'default' | 'success' | 'warning' | 'danger';
}

export default function KpiCard({ label, value, accent = 'default' }: KpiCardProps) {
  return (
    <article className={`tc-kpi-card tc-kpi-${accent}`}>
      <h3>{label}</h3>
      <strong>{value}</strong>
    </article>
  );
}
