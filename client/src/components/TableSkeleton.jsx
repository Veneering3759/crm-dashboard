export default function TableSkeleton({ rows = 8, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="bg-slate-50 px-4 py-3 text-xs text-slate-500">Loading…</div>
      <div className="divide-y divide-slate-200">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 px-4 py-3">
            {Array.from({ length: cols }).map((__, c) => (
              <div
                key={c}
                className="h-4 flex-1 animate-pulse rounded bg-slate-100"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
