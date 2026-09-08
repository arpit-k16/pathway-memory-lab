export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-step-xl">
      <div className="max-w-ledger-width mx-auto px-step-lg flex flex-col md:flex-row items-center justify-between gap-step-base">
        <div className="flex flex-col gap-step-xxs">
          <div className="flex items-center gap-step-sm">
            <span className="font-headline-sm text-headline-sm text-primary font-semibold">MEMORY LAB</span>
            <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">
              &bull; ARCHIVAL MONOGRAPH EXP-084
            </span>
          </div>
          <p className="font-caption-italic text-caption-italic text-on-surface-variant">
            In-Context Learning with Recurrent Working Memory & Transformer State Collisions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-step-md font-label-data-sm text-label-data-sm text-on-surface-variant">
          <span>MODE: CLIENT-SIDE DEMO</span>
          <span className="text-outline-variant">&bull;</span>
          <span>PRECISION: FP32</span>
          <span className="text-outline-variant">&bull;</span>
          <span>MEM-SLOTS: 128-REG</span>
          <span className="text-outline-variant">&bull;</span>
          <a className="text-secondary hover:text-on-surface transition-colors" href="#the-question">
            BACK TO TOP
          </a>
        </div>
      </div>
    </footer>
  );
}
