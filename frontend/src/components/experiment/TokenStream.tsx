interface TokenStreamProps {
  tokens: number[];
  targetPos: number;
  /** Number of tokens already consumed (drives the "past" styling). */
  currentStep: number;
}

/**
 * Renders the input token sequence. Ready to accept real backend token
 * arrays later - it only needs `tokens`, `targetPos`, and `currentStep`.
 */
export function TokenStream({ tokens, targetPos, currentStep }: TokenStreamProps) {
  return (
    <div className="flex flex-col gap-step-xs">
      <div className="flex items-center justify-between">
        <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase tracking-wider font-semibold">
          Input Token Sequence (Length: {tokens.length})
        </span>
        <span className="font-caption-italic text-caption-italic text-on-surface-variant">
          Token cursor moves left-to-right into recurrence
        </span>
      </div>
      <div className="w-full overflow-x-auto py-step-xs">
        <div className="flex items-center gap-step-xs min-w-max">
          {tokens.map((tok, idx) => {
            const isTarget = idx === targetPos;
            const isCurrent = idx === currentStep - 1;
            const isPast = idx < currentStep;

            let bgClass = 'bg-surface-container-low text-on-surface';
            if (isTarget) bgClass = 'bg-tertiary-fixed text-on-tertiary-fixed font-bold shadow-sm';
            if (isPast && !isTarget) bgClass = 'bg-surface-container-high text-on-surface-variant opacity-80';
            if (isCurrent) {
              bgClass = isTarget
                ? 'bg-tertiary-fixed ring-2 ring-primary text-on-tertiary-fixed font-bold'
                : 'bg-primary text-on-primary font-bold';
            }

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center min-w-[42px] h-12 rounded-DEFAULT text-center font-label-data-sm transition-all ${bgClass}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="text-[10px] opacity-70">#{idx}</span>
                <span className="text-sm font-semibold">
                  {tok}
                  {isTarget ? '\u2605' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
