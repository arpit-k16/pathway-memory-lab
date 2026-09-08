interface RetentionCurveProps {
  strokePath: string;
  fillPath: string;
  colorClass: string;
}

export function RetentionCurve({ strokePath, fillPath, colorClass }: RetentionCurveProps) {
  return (
    <div className="w-full h-24 mt-1 flex items-end">
      <svg className={`w-full h-full ${colorClass}`} fill="none" preserveAspectRatio="none" viewBox="0 0 200 60">
        <path d={strokePath} fill="none" stroke="currentColor" strokeWidth={2} />
        <path d={fillPath} fill="currentColor" fillOpacity={0.08} />
      </svg>
    </div>
  );
}
