export default function AttendanceChartPlaceholder() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Attendance trend (placeholder)</div>
          <div className="mt-1 text-sm text-slate-600">Dummy chart area for future analytics integration.</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-surface-50 px-3 py-2 text-xs font-semibold text-slate-700">
          Last 30 days
        </div>
      </div>

      <div className="mt-6 grid h-44 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white">
        <svg width="360" height="120" viewBox="0 0 360 120" aria-hidden="true" className="opacity-90">
          <path
            d="M12 96 C 40 80, 70 70, 100 78 C 130 86, 150 40, 180 52 C 210 64, 230 44, 260 56 C 290 68, 320 34, 348 42"
            fill="none"
            stroke="#1b2d7f"
            strokeWidth="3"
          />
          <path
            d="M12 96 C 40 80, 70 70, 100 78 C 130 86, 150 40, 180 52 C 210 64, 230 44, 260 56 C 290 68, 320 34, 348 42 L 348 110 L 12 110 Z"
            fill="rgba(53,102,255,0.10)"
          />
        </svg>
      </div>
    </div>
  )
}

