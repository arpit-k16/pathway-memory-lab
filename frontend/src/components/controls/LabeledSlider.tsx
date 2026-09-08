interface LabeledSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  minLabel: string;
  midLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

export function LabeledSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  minLabel,
  midLabel,
  maxLabel,
  onChange,
}: LabeledSliderProps) {
  return (
    <div className="flex flex-col gap-step-xs">
      <div className="flex items-center justify-between font-label-data-sm text-label-data-sm">
        <label className="text-on-surface font-medium" htmlFor={id}>
          {label}
        </label>
        <span className="bg-surface-container-lowest px-2 py-0.5 rounded font-bold text-primary shadow-sm">
          {displayValue}
        </span>
      </div>
      <input
        className="w-full accent-primary cursor-pointer"
        id={id}
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="flex justify-between text-[11px] font-label-data-sm text-on-surface-variant">
        <span>{minLabel}</span>
        <span>{midLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
