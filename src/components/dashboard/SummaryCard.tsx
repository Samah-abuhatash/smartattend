export default function SummaryCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
          {hint ? <div className="mt-1 text-sm text-slate-600">{hint}</div> : null}
        </div>
        {icon ? <div className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-100 text-brand-900">{icon}</div> : null}
      </div>
    </div>
  )
}

