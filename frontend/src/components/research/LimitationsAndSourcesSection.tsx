import { LimitationsSection } from './LimitationsSection';
import { SourcesSection } from './SourcesSection';

export function LimitationsAndSourcesSection() {
  return (
    <section
      className="max-w-ledger-width mx-auto px-step-lg py-step-xl pb-step-3xl w-full"
      id="limitations-and-sources"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-step-xl items-start">
        <LimitationsSection />
        <SourcesSection />
      </div>
    </section>
  );
}
