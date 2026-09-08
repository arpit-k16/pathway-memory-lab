import type { ExperimentMetrics, ExperimentPrediction } from '../../types/experiment';
import { StatusBadge, type RecallStatus } from '../common/StatusBadge';

interface QueryRecallProps {
  targetVal: number;
  targetPos: number;
  prediction: ExperimentPrediction | null;
  metrics: ExperimentMetrics | null;
  interference: number;
}

function statusFrom(prediction: ExperimentPrediction | null): RecallStatus {
  if (!prediction) return 'pending';
  return prediction.status;
}

export function QueryRecall({ targetVal, targetPos, prediction, metrics, interference }: QueryRecallProps) {
  const confidencePct = prediction ? Math.round(prediction.confidence * 100) : 0;
  const decodedLabel = prediction
    ? `[ ${prediction.decodedToken !== null ? prediction.decodedToken : '?'} ${
        prediction.decodedToken === targetVal ? '\u2605' : ''
      } ]`
    : '[ \u2014 ]';

  return (
    <div className="lg:col-span-7 bg-surface-container-lowest p-step-lg rounded-DEFAULT shadow-sm flex flex-col gap-step-md">
      <div className="flex items-center justify-between pb-step-xs">
        <div>
          <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold uppercase tracking-wider">
            SECTION 03 &bull; PROBE STAGE
          </span>
          <h3 className="font-headline-md text-headline-md text-primary font-normal mt-step-xxs">
            Now ask the memory what it remembers.
          </h3>
        </div>
        <StatusBadge status={statusFrom(prediction)} />
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant">
        At step T, we issue a read probe targeting token{' '}
        <strong className="font-semibold text-primary">
          {targetVal} &#9733;
        </strong>
        . The model aggregates slot activations, normalizes across slot interference, and attempts recovery.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-step-base my-step-xs">
        <div className="bg-surface-container-low p-step-base rounded-DEFAULT flex flex-col gap-step-xs">
          <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">
            GROUND TRUTH EMISSION
          </span>
          <div className="flex items-baseline gap-step-sm">
            <span className="font-display-xl text-display-xl text-primary font-bold">
              [ {targetVal} &#9733; ]
            </span>
            <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">
              Index = {targetPos}
            </span>
          </div>
          <span className="font-caption-italic text-caption-italic text-on-surface-variant">
            The discrete token injected during initialization.
          </span>
        </div>
        <div className="bg-surface-container-low p-step-base rounded-DEFAULT flex flex-col gap-step-xs">
          <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">
            DECODED STATE RECALL
          </span>
          <div className="flex items-baseline gap-step-sm">
            <span className="font-display-xl text-display-xl font-bold text-secondary">{decodedLabel}</span>
            <span className="font-label-data-sm text-label-data-sm font-semibold text-primary">
              p = {prediction ? prediction.confidence.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mt-1">
            <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${confidencePct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-step-sm pt-step-xs">
        <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
          <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">
            Total Collisions
          </span>
          <div className="font-label-data-lg text-label-data-lg font-bold text-primary mt-1">
            {metrics ? metrics.totalCollisions : '\u2014'}
          </div>
        </div>
        <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
          <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">
            Capacity Pressure
          </span>
          <div className="font-label-data-lg text-label-data-lg font-bold text-primary mt-1">
            {metrics ? `${metrics.capacityPressure.toFixed(2)}\u00d7` : '\u2014'}
          </div>
        </div>
        <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
          <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">
            Slot Utilization
          </span>
          <div className="font-label-data-lg text-label-data-lg font-bold text-primary mt-1">
            {metrics ? `${metrics.slotUtilizationPct.toFixed(1)}%` : '\u2014'}
          </div>
        </div>
        <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
          <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase">
            Target Retention
          </span>
          <div className="font-label-data-lg text-label-data-lg font-bold text-secondary mt-1">
            {metrics ? metrics.targetRetention.toFixed(3) : '\u2014'}
          </div>
        </div>
      </div>

      <details className="bg-surface-container-low p-step-sm rounded-DEFAULT text-on-surface">
        <summary className="font-label-data-sm text-label-data-sm font-semibold uppercase cursor-pointer hover:text-secondary flex items-center justify-between">
          <span>SHOW MATHEMATICAL FORMULATION & RIGOR DETAILS</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </summary>
        <div className="pt-step-sm font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-step-xs">
          <p>
            The toy model maintains recurrent state{' '}
            <span className="font-label-data-sm text-primary">S_t &isin; &#8477;^K</span>. Ingestion maps input{' '}
            <span className="font-label-data-sm text-primary">x_t</span> to index{' '}
            <span className="font-label-data-sm text-primary">k = h(x_t)</span> with additive activation:
          </p>
          <div className="bg-surface-container-lowest p-step-sm rounded-DEFAULT font-label-data-sm text-primary">
            S_&#123;t+1&#125;[k] = (1 - &tau;) &middot; S_t[k] + x_t + &epsilon;_collision
          </div>
          <p>
            When another token hashes to slot <span className="font-label-data-sm text-primary">k</span> while
            target signal still resides within it, interference occurs proportional to parameter{' '}
            <span className="font-label-data-sm text-primary">&tau; = {interference.toFixed(2)}</span> (the
            forgetting/decay rate) and collision magnitude.
          </p>
        </div>
      </details>
    </div>
  );
}
