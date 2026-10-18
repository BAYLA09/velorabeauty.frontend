import type { DailyProfitPoint } from "@/lib/profitAdmin/orderMetrics";

type ProfitLineChartProps = {
  points: DailyProfitPoint[];
};

const COLORS = {
  payment: "#a78bfa",
  cod: "#fb923c",
  total: "#34d399",
};

export function ProfitLineChart({ points }: ProfitLineChartProps) {
  if (points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-500">
        No orders in this period yet.
      </div>
    );
  }

  const width = 640;
  const height = 200;
  const pad = { top: 16, right: 12, bottom: 28, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const allY = points.flatMap((p) => [p.paymentProfitUsd, p.codProfitUsd, p.totalProfitUsd]);
  const maxY = Math.max(1, ...allY);
  const minY = Math.min(0, ...allY);

  const xAt = (i: number) => pad.left + (i / Math.max(1, points.length - 1)) * innerW;
  const yAt = (v: number) => pad.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  function pathFor(key: keyof Pick<DailyProfitPoint, "paymentProfitUsd" | "codProfitUsd" | "totalProfitUsd">) {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(p[key]).toFixed(1)}`)
      .join(" ");
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full min-w-[320px]">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.top + innerH * (1 - t);
          const val = minY + (maxY - minY) * t;
          return (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#334155" strokeWidth={1} />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px]">
                ${Math.round(val)}
              </text>
            </g>
          );
        })}
        <path d={pathFor("paymentProfitUsd")} fill="none" stroke={COLORS.payment} strokeWidth={2} />
        <path d={pathFor("codProfitUsd")} fill="none" stroke={COLORS.cod} strokeWidth={2} />
        <path d={pathFor("totalProfitUsd")} fill="none" stroke={COLORS.total} strokeWidth={2.5} />
        {points.map((p, i) => (
          <text
            key={p.date}
            x={xAt(i)}
            y={height - 6}
            textAnchor="middle"
            className="fill-slate-500 text-[9px]"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
