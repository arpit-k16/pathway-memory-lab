import type { ExperimentConfig } from '../../types/experiment';
import { MetricTile } from '../common/MetricTile';

interface HeroProps {
  config: ExperimentConfig;
}

export function Hero({ config }: HeroProps) {
  const pressure = (config.seqLen / config.slotsK).toFixed(2);

  return (
    <section className="max-w-ledger-width mx-auto px-step-lg pt-step-xl pb-step-2xl w-full" id="the-question">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-step-xl items-start">
        {/* Monograph derivation & thesis statement (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col gap-step-md">
          <div className="flex flex-wrap items-center gap-step-xs">
            <span className="bg-surface-container px-step-sm py-step-xxs text-secondary font-label-data-sm text-label-data-sm uppercase tracking-wider rounded-DEFAULT">
              Interactive Computational Explainer
            </span>
            <span className="text-outline-variant font-label-data-sm text-label-data-sm">&bull;</span>
            <span className="text-on-surface-variant font-label-data-sm text-label-data-sm">
              Pathway "Explain the Frontier"
            </span>
            <span className="text-outline-variant font-label-data-sm text-label-data-sm">&bull;</span>
            <span className="text-on-surface-variant font-label-data-sm text-label-data-sm">
              Monograph Ref: EXP-084-REC
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl text-primary font-normal leading-tight tracking-tight">
            Can a tiny memory remember a long sequence?
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Explore how a fixed-size recurrent state carries information forward across time &mdash; and how
            discrete interference, stochastic slot overwriting, and capacity pressure can cause it to forget.
          </p>

          <div className="bg-surface-container-lowest p-step-base rounded-DEFAULT shadow-sm my-step-xs">
            <div className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase tracking-wider mb-step-xs flex items-center justify-between">
              <span>FIG 1.0 &mdash; RECURRENT INGESTION ARCHITECTURE</span>
              <span className="text-secondary font-medium">O(1) Memory Footprint</span>
            </div>
            <div className="grid grid-cols-4 gap-step-xs items-center text-center font-label-data-md text-label-data-md text-on-surface">
              <div className="bg-surface-container-low p-step-sm rounded-DEFAULT flex flex-col items-center">
                <span className="text-on-surface-variant font-label-data-sm text-label-data-sm">INP</span>
                <span className="font-semibold text-primary">TOKENS</span>
                <span className="font-caption-italic text-caption-italic text-on-surface-variant text-[11px] mt-step-xxs">
                  t = 0 ... T-1
                </span>
              </div>
              <div className="bg-surface-container-high p-step-sm rounded-DEFAULT flex flex-col items-center relative shadow-sm">
                <span className="text-secondary font-label-data-sm text-label-data-sm font-semibold">CORE</span>
                <span className="font-semibold text-primary">FIXED STATE</span>
                <span className="font-caption-italic text-caption-italic text-on-surface-variant text-[11px] mt-step-xxs">
                  dim K slots
                </span>
              </div>
              <div className="bg-surface-container-low p-step-sm rounded-DEFAULT flex flex-col items-center">
                <span className="text-on-surface-variant font-label-data-sm text-label-data-sm">PROBE</span>
                <span className="font-semibold text-primary">QUERY</span>
                <span className="font-caption-italic text-caption-italic text-on-surface-variant text-[11px] mt-step-xxs">
                  read key
                </span>
              </div>
              <div className="bg-surface-container-low p-step-sm rounded-DEFAULT flex flex-col items-center">
                <span className="text-on-surface-variant font-label-data-sm text-label-data-sm">OUT</span>
                <span className="font-semibold text-primary">RECALL</span>
                <span className="font-caption-italic text-caption-italic text-on-surface-variant text-[11px] mt-step-xxs">
                  argmax(s_k)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-step-sm rounded-DEFAULT">
            <span className="font-label-data-sm text-secondary font-semibold">STEP 2 • WHAT IS RECURRENT MEMORY?</span>
            <p className="font-body-sm text-on-surface-variant">One fixed-size state is carried forward. Each arriving token updates that same bounded state; no permanent token-by-token memory row is added. The trace below makes each update visible.</p>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Watch discrete scalar information enter a static register of slots, collide with later tokens, and
            slowly decay or corrupt as sequence depth scales.
          </p>

          <div className="bg-surface-container-high p-step-base rounded-DEFAULT shadow-sm flex flex-col gap-step-xs">
            <div className="flex items-center gap-step-xs text-primary font-label-data-sm text-label-data-sm font-semibold">
              <span className="material-symbols-outlined text-[16px] text-secondary">science</span>
              <span>CENTRAL FALSIFIABLE CLAIM</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface italic leading-snug">A fixed-shape recurrent state can process arbitrarily long sequences without allocating one new memory slot per token.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-step-xs text-sm"><p><strong>LIMITATION</strong><br />Fixed capacity does not imply unlimited faithful recall.</p><p><strong>MECHANISM</strong><br />Collisions and interference can make earlier information harder to recover.</p></div>
            <div className="font-label-data-sm text-label-data-sm text-on-surface-variant flex items-center justify-between pt-step-xxs"><span>TOY EXPERIMENT • evidence for this mechanism only</span><span className="text-secondary font-semibold">STEP 1: SEE IT WORK</span></div>
          </div>
        </div>

        {/* Quick Status & Overview Apparatus Ledger Card (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col gap-step-base bg-surface-container-low p-step-lg rounded-DEFAULT shadow-sm">
          <div className="flex items-center justify-between pb-step-xs bg-surface-container-low">
            <div className="flex items-center gap-step-xs">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-label-data-sm text-label-data-sm text-primary font-semibold uppercase tracking-wider">
                APPARATUS METRIC REGISTER
              </span>
            </div>
            <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">T = LIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-step-sm">
            <MetricTile
              label="TARGET TOKEN"
              value={`[ ${config.targetVal} \u2605 ] @ pos ${config.targetPos}`}
              emphasis="secondary"
            />
            <MetricTile label="CAPACITY PRESSURE" value={`${pressure}\u00d7`} />
            <MetricTile label="RECURRENT SLOTS" value={`K = ${config.slotsK}`} />
            <MetricTile label="INTERFERENCE \u03c4" value={config.interference.toFixed(2)} />
          </div>

          <div className="bg-surface-container-lowest p-step-sm rounded-DEFAULT flex flex-col gap-step-xxs">
            <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">
              DISCRETE PROJECTION CHANNEL
            </span>
            <div className="w-full h-12 flex items-center justify-between px-step-sm bg-surface-container-low rounded-DEFAULT overflow-hidden relative">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary text-on-primary text-[10px] font-label-data-sm flex items-center justify-center font-bold">
                  4
                </span>
                <span className="w-6 h-6 rounded bg-primary text-on-primary text-[10px] font-label-data-sm flex items-center justify-center font-bold">
                  9
                </span>
                <span className="w-6 h-6 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-label-data-sm flex items-center justify-center font-bold shadow-sm">
                  {config.targetVal}&#9733;
                </span>
                <span className="w-6 h-6 rounded bg-primary text-on-primary text-[10px] font-label-data-sm flex items-center justify-center font-bold">
                  2
                </span>
                <span className="text-on-surface-variant text-[11px] font-label-data-sm">...</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                <div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-data-sm font-bold shadow-sm">
                  K[{config.slotsK}]
                </div>
              </div>
            </div>
            <p className="font-caption-italic text-caption-italic text-on-surface-variant mt-step-xxs">
              Information density scales with sequence length T while memory manifold area remains invariant.
            </p>
          </div>

          <div className="flex items-center justify-between pt-step-xxs">
            <a
              className="inline-flex items-center gap-step-xs bg-primary text-on-primary px-step-md py-step-xs rounded-DEFAULT font-label-data-sm text-label-data-sm font-medium hover:bg-primary-container transition-transform active:translate-y-[1px]"
              href="#live-experiment"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('live-experiment')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>COMMENCE RECURRENT TRACE</span>
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>
            <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">EXP-01 TO 09 READY</span>
          </div>
          <a href="#pressure-sandbox" className="text-center bg-error-container text-on-error-container px-step-md py-step-xs rounded-DEFAULT font-label-data-sm font-bold">STEP 3: BREAK THE MEMORY → choose “break the memory” below</a>
        </div>
      </div>
    </section>
  );
}
