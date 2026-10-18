type DonutChartProps = {
  percent: number;
  color: string;
  label: string;
  size?: number;
};

export function DonutChart({ percent, color, label, size = 120 }: DonutChartProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <p className="text-lg font-semibold text-white">{clamped.toFixed(1)}%</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
