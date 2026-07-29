export function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-2">
          <span className="text-[10px] text-muted opacity-0 transition group-hover:opacity-100">${v.toLocaleString()}</span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-brand/40 to-gold transition-all duration-500 hover:from-brand hover:to-gold"
            style={{ height: `${(v / max) * 100}%`, minHeight: 6 }}
          />
          <span className="text-[10px] text-muted">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${40 - (v / max) * 36}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-12 w-full">
      <polyline points={pts} fill="none" stroke="url(#g)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#e9b949" />
        </linearGradient>
      </defs>
    </svg>
  );
}
