interface CollisionAlertProps {
  eventText: string;
  hadCollision: boolean;
  currentStep: number;
}

export function CollisionAlert({ eventText, hadCollision, currentStep }: CollisionAlertProps) {
  const boxClass = hadCollision
    ? 'bg-error-container text-on-error-container p-step-sm rounded-DEFAULT flex items-center justify-between transition-colors duration-200'
    : 'bg-surface-container p-step-sm rounded-DEFAULT flex items-center justify-between text-on-surface transition-colors duration-200';

  return (
    <div className={boxClass} role="status">
      <div className="flex items-center gap-step-sm">
        <span
          className={`material-symbols-outlined text-[18px] ${hadCollision ? 'text-error' : 'text-secondary'}`}
          aria-hidden="true"
        >
          {hadCollision ? 'error' : 'info'}
        </span>
        <span className="font-label-data-sm text-label-data-sm">{eventText}</span>
      </div>
      <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">t = {currentStep}</span>
    </div>
  );
}
