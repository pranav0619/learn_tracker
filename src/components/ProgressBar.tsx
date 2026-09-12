interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export default function ProgressBar({
  percentage,
  showLabel = false,
  size = 'md',
  className = '',
  id,
}: ProgressBarProps) {
  // Clamp between 0 and 100
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  return (
    <div id={id} className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-mono">
          <span>Progress</span>
          <span className="font-semibold text-zinc-200">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full bg-zinc-800/90 rounded-full overflow-hidden ${heightClasses} p-0.5 border border-zinc-700/40`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${clamped}%`}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300 ease-out shadow-sm shadow-emerald-500/20"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
