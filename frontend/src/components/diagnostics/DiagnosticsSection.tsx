import type { UseExperimentResult } from '../../hooks/useExperiment';

export function DiagnosticsSection({ experiment }: { experiment: UseExperimentResult }) {
  const r = experiment.result;
  if (!r) return null;

  const m = r.metrics;
  const gt = r.ground_truth;
  const p = r.prediction;
  const ex = r.explanation;

  const slotWrites = m.slot_write_counts ?? [];
  const maxWrites = Math.max(...slotWrites, 1);

  return (
    <section
      className="max-w-ledger-width mx-auto px-step-lg py-step-xl w-full"
      id="diagnostics"
    >
      <div className="bg-surface-container-lowest p-step-lg rounded-DEFAULT shadow-sm flex flex-col gap-step-lg">
        <div>
          <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold uppercase tracking-wider">
            SECTION 04 • DIAGNOSTICS &amp; MEMORY HEALTH
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-normal mt-step-xxs">
            Inspect the memory under the hood.
          </h2>
        </div>

        {/* Claim test outcome */}
        <div className="bg-surface-container-low p-step-base rounded-DEFAULT flex flex-col gap-step-xs">
          <div className="flex items-center gap-step-xs">
            <span className="material-symbols-outlined text-[18px] text-secondary">science</span>
            <span className="font-label-data-sm text-label-data-sm text-primary font-semibold uppercase">
              CLAIM TEST RESULT
            </span>
            <span
              className={`ml-auto px-step-sm py-step-xxs rounded-DEFAULT font-label-data-sm font-bold ${
                ex.claim_test_result.outcome === 'recall_success'
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                  : ex.claim_test_result.outcome === 'recall_degraded'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {ex.claim_test_result.outcome.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {ex.claim_test_result.evidence}
          </p>
          <p className="font-caption-italic text-caption-italic text-on-surface-variant">
            Scope: {ex.claim_test_result.scope}
          </p>
        </div>

        {/* Mechanism / Observation / Limitation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-step-base">
          <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
            <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold">
              MECHANISM
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-step-xxs">
              {ex.mechanism}
            </p>
          </div>
          <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
            <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold">
              OBSERVATION
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-step-xxs">
              {ex.observation}
            </p>
          </div>
          <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
            <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold">
              LIMITATION
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-step-xxs">
              {ex.limitation}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-step-sm">
          {[
            ['ACCURACY', `${(m.accuracy * 100).toFixed(1)}%`],
            ['COLLISION RATE', `${(m.collision_rate * 100).toFixed(1)}%`],
            ['CAPACITY PRESSURE', `${m.capacity_pressure.toFixed(2)}×`],
            ['STATE NORM', m.state_norm.toFixed(3)],
            ['MEMORY UTILIZATION', `${(m.memory_utilization * 100).toFixed(1)}%`],
            ['ACTIVE SLOTS', String(m.active_slots)],
            ['TOTAL COLLISIONS', String(m.collision_count)],
            ['PREDICTION CONFIDENCE', `${(m.prediction_confidence * 100).toFixed(1)}%`],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface-container-low p-step-sm rounded-DEFAULT">
              <span className="font-label-data-sm text-label-data-sm text-on-surface-variant block">
                {label}
              </span>
              <div className="font-bold text-primary text-lg">{value}</div>
            </div>
          ))}
        </div>

        {/* Per-Slot Write Distribution */}
        {slotWrites.length > 0 && (
          <div className="bg-surface-container-low p-step-base rounded-DEFAULT">
            <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold block mb-step-xs">
              PER-SLOT WRITE DISTRIBUTION
            </span>
            <div className="flex items-end gap-[2px] h-16">
              {slotWrites.map((count, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: `${(count / maxWrites) * 100}%`,
                    minHeight: count > 0 ? '4px' : '1px',
                    backgroundColor:
                      i === p.target_slot
                        ? 'var(--color-secondary)'
                        : count > maxWrites * 0.7
                        ? 'var(--color-error)'
                        : 'var(--color-primary)',
                    opacity: count > 0 ? 1 : 0.2,
                  }}
                  title={`Slot ${i}: ${count} writes`}
                />
              ))}
            </div>
            <div className="flex justify-between font-label-data-sm text-label-data-sm text-on-surface-variant mt-step-xxs">
              <span>Slot 0</span>
              <span>Target slot: {p.target_slot}</span>
              <span>Slot {slotWrites.length - 1}</span>
            </div>
          </div>
        )}

        {/* Ground Truth Summary */}
        <div className="bg-surface-container-low p-step-sm rounded-DEFAULT grid grid-cols-2 sm:grid-cols-4 gap-step-sm">
          <div>
            <span className="font-label-data-sm text-on-surface-variant block">TARGET TOKEN</span>
            <span className="font-bold text-primary">{gt.target_token} ★</span>
          </div>
          <div>
            <span className="font-label-data-sm text-on-surface-variant block">TARGET POSITION</span>
            <span className="font-bold text-primary">{gt.target_position}</span>
          </div>
          <div>
            <span className="font-label-data-sm text-on-surface-variant block">QUERY POSITION</span>
            <span className="font-bold text-primary">{gt.query_position}</span>
          </div>
          <div>
            <span className="font-label-data-sm text-on-surface-variant block">SEEN BEFORE QUERY</span>
            <span className="font-bold text-primary">{gt.target_seen_before_query ? 'YES' : 'NO'}</span>
          </div>
        </div>

        {experiment.loading && <span role="status">Refreshing diagnostics…</span>}
        {experiment.error && (
          <span className="text-error" role="alert">
            {experiment.error}
          </span>
        )}
      </div>
    </section>
  );
}
