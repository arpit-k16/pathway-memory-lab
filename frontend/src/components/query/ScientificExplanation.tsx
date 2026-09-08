interface ScientificExplanationProps {
  explanation: string | null;
}

const PLACEHOLDER =
  'Run or step through the trace above to see recall play out. Once the sequence completes, this panel explains why the target signal survived, degraded, or was lost.';

export function ScientificExplanation({ explanation }: ScientificExplanationProps) {
  return (
    <div className="lg:col-span-5 bg-surface-container-low p-step-lg rounded-DEFAULT shadow-sm flex flex-col gap-step-base">
      <div className="flex items-center gap-step-xs">
        <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold uppercase tracking-wider">
          SECTION 04 &bull; SCIENTIFIC EXPLANATION
        </span>
      </div>
      <h3 className="font-headline-md text-headline-md text-primary font-normal">
        Why does the model succeed or forget?
      </h3>

      <div className="bg-surface-container-lowest p-step-base rounded-DEFAULT shadow-sm flex flex-col gap-step-sm">
        <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold uppercase">
          OBSERVED IN-CONTEXT DYNAMICS
        </span>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">{explanation ?? PLACEHOLDER}</p>
      </div>

      <div className="flex flex-col gap-step-xs font-body-sm text-body-sm text-on-surface-variant">
        <div className="flex items-start gap-step-xs">
          <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
          <p>
            <strong>Capacity Threshold:</strong> Sequences with length &gt; 4&times; the number of slots exhibit
            exponential collision cascades.
          </p>
        </div>
        <div className="flex items-start gap-step-xs">
          <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
          <p>
            <strong>Decay vs Interference:</strong> Recurrent models balance decaying old tokens to free registers
            against preserving distant contextual cues.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-high p-step-sm rounded-DEFAULT font-caption-italic text-caption-italic text-on-surface-variant">
        "This toy system isolates structural capacity contention from high-dimensional neural representations."
      </div>
    </div>
  );
}
