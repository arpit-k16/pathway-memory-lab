import type { ClaimTestResult } from '../../types/experiment';
import { RetentionCurve } from './RetentionCurve';

interface RegimeCardProps {
  regime: ClaimTestResult;
}

export function RegimeCard({ regime }: RegimeCardProps) {
  const isFailing = regime.status !== 'success';
  const labelColor = isFailing ? 'text-error' : 'text-secondary';
  const badgeClass = isFailing
    ? 'bg-error-container text-on-error-container px-step-sm py-step-xxs rounded-DEFAULT font-label-data-sm text-label-data-sm font-bold'
    : 'bg-surface-container px-step-sm py-step-xxs rounded-DEFAULT font-label-data-sm text-label-data-sm font-bold text-primary';
  const badgeText = isFailing ? 'RECALL DEGRADED / FAILED' : 'RECALL SUCCESS';
  const curveColor = isFailing ? 'text-error' : 'text-secondary';
  const collisionColor = isFailing ? 'text-error' : 'text-primary';
  const confidenceColor = isFailing ? 'text-error' : 'text-secondary';

  return (
    <div className="bg-surface-container-lowest p-step-lg rounded-DEFAULT shadow-sm flex flex-col justify-between gap-step-base">
      <div className="flex flex-col gap-step-xs">
        <div className="flex items-center justify-between">
          <span className={`font-label-data-sm text-label-data-sm ${labelColor} font-bold uppercase tracking-wider`}>
            {regime.regimeLabel}
          </span>
          <span className={badgeClass}>{badgeText}</span>
        </div>
        <h4 className="font-headline-sm text-headline-sm text-primary font-semibold">
          K = {regime.slotsK} slots / T = {regime.seqLen} tokens ({regime.capacityPressure.toFixed(1)}
          &times; pressure)
        </h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{regime.description}</p>
      </div>

      <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
        <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">
          SIGNAL RETENTION OVER SEQUENCE TIME
        </span>
        <RetentionCurve
          strokePath={regime.retentionCurvePath}
          fillPath={regime.retentionCurveFillPath}
          colorClass={curveColor}
        />
        <div className="flex justify-between font-label-data-sm text-[10px] text-on-surface-variant mt-1">
          <span>t = 0 (Injection)</span>
          <span>Signal Loss: ~{regime.signalLossPct}%</span>
          <span>t = T (Query)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-step-xs font-label-data-sm text-label-data-sm">
        <div className="bg-surface-container-low p-step-xs rounded-DEFAULT">
          <span className="text-on-surface-variant">Collisions:</span>{' '}
          <strong className={collisionColor}>{regime.collisions} event{regime.collisions === 1 ? '' : 's'}</strong>
        </div>
        <div className="bg-surface-container-low p-step-xs rounded-DEFAULT">
          <span className="text-on-surface-variant">Confidence:</span>{' '}
          <strong className={confidenceColor}>
            {regime.confidencePct}%{isFailing ? ' (Random)' : ''}
          </strong>
        </div>
      </div>
    </div>
  );
}
