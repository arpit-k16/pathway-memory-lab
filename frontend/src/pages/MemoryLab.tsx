import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/hero/Hero';
import { ExperimentSection } from '../components/experiment/ExperimentSection';
import { QuerySection } from '../components/query/QuerySection';
import { PressureSandbox } from '../components/controls/PressureSandbox';
import { DiagnosticsSection } from '../components/diagnostics/DiagnosticsSection';
import { ComparisonSection } from '../components/comparison/ComparisonSection';
import { SweepSection } from '../components/sweep/SweepSection';
import { TheoryAndBdhSection } from '../components/research/TheoryAndBdhSection';
import { LimitationsAndSourcesSection } from '../components/research/LimitationsAndSourcesSection';
import { useExperiment } from '../hooks/useExperiment';

/** Tracks how far the reader has scrolled through the page, for the header progress bar. */
function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)));
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return progress;
}

export function MemoryLab() {
  const experiment = useExperiment();
  const progressPct = useScrollProgress();

  return (
    <>
      <Header progressPct={progressPct} onPreset={experiment.runPreset} isRunning={experiment.loading} />
      <main className="w-full pt-28 bg-surface">
        <div className="flex flex-col w-full">
          <Hero config={experiment.config} />
          <ExperimentSection experiment={experiment} />
          <QuerySection experiment={experiment} />
          <DiagnosticsSection experiment={experiment} />
          <PressureSandbox key={JSON.stringify(experiment.config)} config={experiment.config} presets={experiment.presets} onRun={experiment.runWithConfig} onPreset={experiment.runPreset} loading={experiment.loading} />
          <ComparisonSection />
          <SweepSection />
          <TheoryAndBdhSection />
          <LimitationsAndSourcesSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
