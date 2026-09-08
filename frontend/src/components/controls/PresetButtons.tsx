import type { Preset } from '../../types/experiment';
import { PRESETS } from '../../data/demoData';

interface PresetButtonsProps {
  onSelect: (preset: Preset) => void;
}

export function PresetButtons({ onSelect }: PresetButtonsProps) {
  return (
    <div className="flex flex-col gap-step-xs">
      <span className="font-label-data-sm text-label-data-sm text-on-surface-variant uppercase tracking-wider font-semibold">
        Curated Laboratory Presets
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-step-xs">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            id={`preset-${preset.id}`}
            type="button"
            className={
              preset.tone === 'danger'
                ? 'bg-surface-container-low hover:bg-error-container text-error p-step-sm rounded-DEFAULT text-left transition-all active:translate-y-[1px]'
                : 'bg-surface-container-low hover:bg-surface-container-high text-primary p-step-sm rounded-DEFAULT text-left transition-all active:translate-y-[1px]'
            }
            onClick={() => onSelect(preset)}
          >
            <div className="font-label-data-sm text-label-data-sm font-semibold">{preset.label}</div>
            <div className="font-caption-italic text-caption-italic text-on-surface-variant text-[11px]">
              {preset.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
