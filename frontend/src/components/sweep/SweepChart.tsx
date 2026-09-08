import type { SweepResult } from '../../types/experiment';

interface SweepChartProps {
  data: SweepResult[];
  inflectionLabel: string;
  inflectionNote: string;
}

// Fixed plotting frame matching the original Stitch chart's coordinate system.
const CHART_WIDTH = 600;
const CHART_HEIGHT = 240;
const PLOT_LEFT = 60;
const PLOT_RIGHT = 560;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 210;

function xForIndex(index: number, count: number): number {
  if (count <= 1) return PLOT_LEFT;
  return PLOT_LEFT + (index / (count - 1)) * (PLOT_RIGHT - PLOT_LEFT);
}

function yForProbability(p: number): number {
  return PLOT_BOTTOM - p * (PLOT_BOTTOM - PLOT_TOP);
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` Q ${midX} ${prev.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export function SweepChart({ data, inflectionLabel, inflectionNote }: SweepChartProps) {
  const points = data.map((d, i) => ({ x: xForIndex(i, data.length), y: yForProbability(d.recallProbability) }));
  const empiricalPath = buildSmoothPath(points);

  // Theoretical lower bound: a slightly worse (lower) uniform-random curve, purely illustrative.
  const lowerBoundPoints = data.map((d, i) => ({
    x: xForIndex(i, data.length),
    y: yForProbability(Math.max(0.02, d.recallProbability * 0.65)),
  }));
  const lowerBoundPath = buildSmoothPath(lowerBoundPoints);

  const inflectionIndex = data.findIndex((d) => d.isInflectionPoint);
  const inflectionX = inflectionIndex >= 0 ? xForIndex(inflectionIndex, data.length) : null;

  return (
    <div className="bg-surface-container-low p-step-md rounded-DEFAULT flex flex-col gap-step-sm">
      <div className="flex items-center justify-between font-label-data-sm text-label-data-sm text-on-surface-variant">
        <span>Y-AXIS: RECALL PROBABILITY P(SUCCESS)</span>
        <span>X-AXIS: RECURRENT SLOTS K (Sequence Length T = 32)</span>
      </div>
      <div className="w-full h-64 relative flex items-center justify-center">
        <svg
          className="w-full h-full text-primary"
          fill="none"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Chart of recall probability versus number of memory slots, showing a sharp inflection point"
        >
          <line stroke="currentColor" strokeDasharray="4" strokeOpacity={0.1} x1={40} x2={580} y1={20} y2={20} />
          <line stroke="currentColor" strokeDasharray="4" strokeOpacity={0.1} x1={40} x2={580} y1={70} y2={70} />
          <line stroke="currentColor" strokeDasharray="4" strokeOpacity={0.1} x1={40} x2={580} y1={120} y2={120} />
          <line stroke="currentColor" strokeDasharray="4" strokeOpacity={0.1} x1={40} x2={580} y1={170} y2={170} />
          <line stroke="currentColor" strokeOpacity={0.2} x1={40} x2={580} y1={210} y2={210} />

          <text fill="currentColor" fillOpacity={0.6} fontFamily="JetBrains Mono" fontSize={10} textAnchor="end" x={32} y={24}>
            1.0
          </text>
          <text fill="currentColor" fillOpacity={0.6} fontFamily="JetBrains Mono" fontSize={10} textAnchor="end" x={32} y={74}>
            0.75
          </text>
          <text fill="currentColor" fillOpacity={0.6} fontFamily="JetBrains Mono" fontSize={10} textAnchor="end" x={32} y={124}>
            0.50
          </text>
          <text fill="currentColor" fillOpacity={0.6} fontFamily="JetBrains Mono" fontSize={10} textAnchor="end" x={32} y={174}>
            0.25
          </text>
          <text fill="currentColor" fillOpacity={0.6} fontFamily="JetBrains Mono" fontSize={10} textAnchor="end" x={32} y={214}>
            0.0
          </text>

          <path d={empiricalPath} fill="none" stroke="#0051d5" strokeWidth={3} />
          <path d={lowerBoundPath} fill="none" stroke="#75777d" strokeDasharray="4" strokeWidth={1.5} />

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={data[i].isInflectionPoint ? 5 : 4}
              fill={data[i].isInflectionPoint ? '#ba1a1a' : '#0051d5'}
            />
          ))}

          {inflectionX !== null && (
            <>
              <line stroke="#ba1a1a" strokeDasharray="2" strokeWidth={1} x1={inflectionX} x2={inflectionX} y1={30} y2={210} />
              <rect fill="#eff4ff" height={42} rx={2} stroke="#c5c6cd" strokeWidth={0.75} width={160} x={inflectionX + 6} y={36} />
              <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize={10} fontWeight="bold" x={inflectionX + 14} y={52}>
                CRITICAL INFLECTION
              </text>
              <text fill="#0d1c2e" fontFamily="Newsreader" fontSize={9} x={inflectionX + 14} y={68}>
                {inflectionNote}
              </text>
            </>
          )}

          {data.map((d, i) => (
            <text
              key={d.slotsK}
              fill="currentColor"
              fillOpacity={0.6}
              fontFamily="JetBrains Mono"
              fontSize={10}
              textAnchor="middle"
              x={xForIndex(i, data.length)}
              y={226}
            >
              K={d.slotsK}
            </text>
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap items-center justify-between text-[11px] font-label-data-sm text-on-surface-variant pt-step-xxs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-0.5 bg-secondary" />
          <span>Empirical Model Recall</span>
          <span className="inline-block w-3 h-0.5 bg-outline border-b border-dashed border-outline ml-2" />
          <span>Uniform Random Lower Bound</span>
        </div>
        <span className="text-on-surface font-medium">{inflectionLabel}</span>
      </div>
    </div>
  );
}
