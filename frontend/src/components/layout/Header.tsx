import { useEffect, useState } from 'react';
import { NAV_SECTIONS, PRESETS } from '../../data/demoData';

interface HeaderProps {
  progressPct: number;
  onPreset: (name: string) => Promise<void>;
  isRunning: boolean;
}

const BACKEND_PRESET_NAMES: Record<string, string> = {
  baseline: 'baseline', long: 'long_sequence', capacity: 'low_capacity', interference: 'high_interference', break: 'break_the_memory',
};

export function Header({ progressPct, onPreset, isRunning }: HeaderProps) {
  const [activePath, setActivePath] = useState<string>(NAV_SECTIONS[0].id);

  useEffect(() => {
    const sections = NAV_SECTIONS.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActivePath(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isRunning]);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePresetClick = (id: string) => async (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pressure-sandbox')?.scrollIntoView({ behavior: 'smooth' });
    await onPreset(BACKEND_PRESET_NAMES[id]);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-28 max-w-ledger-width mx-auto px-step-lg flex flex-col justify-between pt-step-xs pb-0">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-step-xs">
          <div className="flex items-center gap-step-md">
            <div className="flex items-baseline gap-step-sm">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-semibold">
                MEMORY LAB
              </span>
              <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase tracking-wider">
                v2.4-rec
              </span>
            </div>
            <div className="hidden md:flex items-center gap-step-xs bg-surface-container px-step-sm py-step-xxs rounded-DEFAULT border border-outline-variant/40">
              <span className="font-label-data-sm text-label-data-sm text-secondary font-medium">Pathway</span>
              <span className="text-outline-variant font-label-data-sm text-label-data-sm">&bull;</span>
              <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">
                Explain the Frontier
              </span>
            </div>
            <div className="hidden lg:inline-block font-caption-italic text-caption-italic text-on-surface-variant pl-step-xs">
              Interactive Computational Explainer
            </div>
          </div>
          <div className="flex items-center gap-step-md">
            <div className="flex items-center gap-step-sm bg-surface-container-low px-step-sm py-step-xxs rounded-DEFAULT border border-outline-variant/40">
              <div className="flex items-center gap-step-xs">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-data-sm text-label-data-sm text-on-surface font-medium">
                  Demo Mode
                </span>
              </div>
              <span className="font-label-data-sm text-label-data-sm text-outline-variant">|</span>
              <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">
                Local Recurrent Core
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-step-xs bg-surface-container px-step-sm py-step-xxs rounded-DEFAULT">
              <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">PRESETS:</span>
              {PRESETS.map((preset, i) => (
                <span key={preset.id} className="flex items-center gap-step-xs">
                  <button
                    type="button"
                    disabled={isRunning}
                    className={`font-label-data-sm text-label-data-sm transition-colors ${
                      preset.tone === 'danger'
                        ? 'text-error hover:text-on-surface'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                    onClick={handlePresetClick(preset.id)}
                  >
                    {preset.label.replace(/^\d+\s/, '').slice(0, 8)}
                  </button>
                  {i < PRESETS.length - 1 && (
                    <span className="text-outline-variant font-label-data-sm text-label-data-sm">/</span>
                  )}
                </span>
              ))}
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between overflow-x-auto py-step-xxs">
          <nav className="flex items-center gap-step-md whitespace-nowrap">
            {NAV_SECTIONS.map((section) => {
              const isActive = section.id === activePath;
              return (
                <a
                  key={section.id}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'pb-step-xxs transition-colors text-primary font-semibold border-b-2 border-secondary font-label-data-sm text-label-data-sm'
                      : 'font-label-data-sm text-label-data-sm text-on-surface-variant hover:text-on-surface pb-step-xxs transition-colors'
                  }
                  href={`#${section.id}`}
                  onClick={handleNavClick(section.id)}
                >
                  {section.label}
                </a>
              );
            })}
          </nav>
          <div className="hidden xl:flex items-center gap-step-sm pl-step-md">
            <span className="font-label-data-sm text-label-data-sm text-on-surface-variant">PROGRESS</span>
            <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="font-label-data-sm text-label-data-sm text-on-surface font-semibold">
              {Math.round(progressPct)}%
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-outline-variant/40" />
    </header>
  );
}
