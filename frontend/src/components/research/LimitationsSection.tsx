const LIMITATIONS = [
  {
    id: '01',
    title: '01 TOY PROJECTION MODEL',
    body: 'This interactive apparatus is an educational discrete simulator. It uses a hash modulo routing function rather than multi-layer neural weight transformations.',
  },
  {
    id: '02',
    title: '02 CONTINUOUS MANIFOLDS',
    body: 'Real recurrent states (e.g. RWKV, Mamba, LSTM) utilize high-dimensional vector spaces (d=4096) where tokens occupy distributed soft directions rather than isolated scalar slots.',
  },
  {
    id: '03',
    title: '03 SELECTIVE GATING',
    body: 'State space models use input-dependent gating to selectively ignore distractor tokens entirely, drastically reducing actual empirical interference.',
  },
  {
    id: '04',
    title: '04 TASK SPECIALIZATION',
    body: 'Single-run results are configuration-specific and should not be treated as universal evidence about recurrent models.',
  },
  { id: '05', title: '05 NOT TRAINED', body: 'This engine is not a neural architecture trained on a corpus.' },
  { id: '06', title: '06 EXPLICIT COLLISIONS', body: 'Its collision mechanism is intentionally visible for teaching rather than learned routing.' },
  { id: '07', title: '07 NOT BDH / BDH-CQ', body: 'The comparison to BDH and BDH-CQ is conceptual, not an implementation or benchmark reproduction.' },
  { id: '08', title: '08 FINITE TOY STATE', body: 'Simplified scalar slot updates isolate one mechanism and omit most properties of modern language models.' },
];

export function LimitationsSection() {
  return (
    <div className="lg:col-span-7 flex flex-col gap-step-md">
      <div className="flex items-center gap-step-xs">
        <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold uppercase tracking-wider">
          SECTION 10 &bull; EPISTEMIC BOUNDS
        </span>
      </div>
      <h3 className="font-headline-lg text-headline-lg text-primary font-normal">
        What this experiment does NOT prove
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-step-sm">
        {LIMITATIONS.map((item) => (
          <div key={item.id} className="bg-surface-container-lowest p-step-base rounded-DEFAULT shadow-sm flex flex-col gap-step-xxs">
            <span className="font-label-data-sm text-label-data-sm text-primary font-semibold">{item.title}</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-high p-step-base rounded-DEFAULT shadow-sm flex flex-col gap-step-xs mt-step-xs">
        <div className="flex items-center gap-step-xs text-primary font-label-data-sm text-label-data-sm font-semibold">
          <span className="material-symbols-outlined text-[16px] text-error">warning</span>
          <span>CRITICAL COMMON MISCONCEPTION</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface leading-snug">
          "Fixed-size memory does <strong>NOT</strong> mean infinite information can be preserved perfectly without
          loss. It only means memory consumption remains constant while information fidelity can degrade under
          sequence pressure."
        </p>
      </div>
    </div>
  );
}
