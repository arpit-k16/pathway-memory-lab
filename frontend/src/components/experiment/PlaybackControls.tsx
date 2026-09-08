import { PLAYBACK_SPEEDS } from '../../data/demoData';

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-step-base bg-surface-container-low p-step-sm rounded-DEFAULT">
      <div className="flex items-center gap-step-xs">
        <button
          type="button"
          className="bg-surface-container-lowest hover:bg-surface-container text-primary font-label-data-sm text-label-data-sm px-step-sm py-step-xs rounded-DEFAULT shadow-sm flex items-center gap-1 transition-all active:translate-y-[1px]"
          onClick={onReset}
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>RESET</span>
        </button>
        <button
          type="button"
          className="bg-surface-container-lowest hover:bg-surface-container text-primary font-label-data-sm text-label-data-sm px-step-sm py-step-xs rounded-DEFAULT shadow-sm flex items-center gap-1 transition-all active:translate-y-[1px]"
          onClick={onStepBack}
          disabled={currentStep <= 0}
        >
          <span className="material-symbols-outlined text-[16px]">skip_previous</span>
          <span>STEP BACK</span>
        </button>
        <button
          type="button"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-data-sm text-label-data-sm px-step-md py-step-xs rounded-DEFAULT shadow-sm flex items-center gap-1 transition-all active:translate-y-[1px]"
          onClick={onTogglePlay}
        >
          <span className="material-symbols-outlined text-[16px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
          <span>{isPlaying ? 'PAUSE' : 'PLAY TRACE'}</span>
        </button>
        <button
          type="button"
          className="bg-surface-container-lowest hover:bg-surface-container text-primary font-label-data-sm text-label-data-sm px-step-sm py-step-xs rounded-DEFAULT shadow-sm flex items-center gap-1 transition-all active:translate-y-[1px]"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
        >
          <span>STEP FORWARD</span>
          <span className="material-symbols-outlined text-[16px]">skip_next</span>
        </button>
      </div>

      <div className="flex items-center gap-step-md font-label-data-sm text-label-data-sm">
        <div className="flex items-center gap-step-xs">
          <span className="text-on-surface-variant">SPEED:</span>
          <div className="flex items-center bg-surface-container-lowest rounded-DEFAULT p-0.5 shadow-sm">
            {PLAYBACK_SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                className={
                  s === speed
                    ? 'px-2 py-0.5 rounded-DEFAULT bg-primary text-on-primary font-semibold'
                    : 'px-2 py-0.5 rounded-DEFAULT text-on-surface hover:bg-surface-container'
                }
                onClick={() => onSpeedChange(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-step-xs bg-surface-container-lowest px-step-sm py-0.5 rounded-DEFAULT shadow-sm">
          <span className="text-on-surface-variant">STEP:</span>
          <span className="font-bold text-primary">
            {String(currentStep).padStart(2, '0')} / {totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}
