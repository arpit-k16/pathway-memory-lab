interface MetricTileProps {
  label: string;
  value: string;
  emphasis?: 'primary' | 'secondary';
  size?: 'sm' | 'lg';
}

/** A single labeled value cell, used throughout metric grids and ledgers. */
export function MetricTile({ label, value, emphasis = 'primary', size = 'sm' }: MetricTileProps) {
  const valueColor = emphasis === 'secondary' ? 'text-secondary' : 'text-primary';
  const valueSize = size === 'lg' ? 'font-label-data-lg text-label-data-lg' : 'font-label-data-md text-label-data-md';

  return (
    <div className="bg-surface-container-lowest p-step-sm rounded-DEFAULT shadow-sm flex flex-col">
      <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">{label}</span>
      <span className={`${valueSize} font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}
