export type RecallStatus = 'success' | 'degraded' | 'failure' | 'pending';

const STATUS_STYLES: Record<RecallStatus, string> = {
  success: 'bg-surface-container text-secondary',
  degraded: 'bg-tertiary-fixed text-on-tertiary-fixed',
  failure: 'bg-error-container text-on-error-container',
  pending: 'bg-surface-container text-primary',
};

const STATUS_LABELS: Record<RecallStatus, string> = {
  success: 'RECALL SUCCESS',
  degraded: 'RECALL DEGRADED',
  failure: 'RECALL FAILURE',
  pending: 'AWAITING COMPLETION',
};

interface StatusBadgeProps {
  status: RecallStatus;
  /** Override the default label text if needed. */
  label?: string;
}

/** Text + color coded badge - never relies on color alone (see icon-free label). */
export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`px-step-sm py-step-xxs rounded-DEFAULT font-label-data-sm text-label-data-sm font-bold uppercase ${STATUS_STYLES[status]}`}
    >
      {label ?? STATUS_LABELS[status]}
    </span>
  );
}
