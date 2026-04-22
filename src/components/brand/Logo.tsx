export default function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-950 text-white shadow-card">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5a2 2 0 0 0-.586-1.414l-3.5-3.5A2 2 0 0 0 13.5 4H7Zm6 1.75V9a1 1 0 0 0 1 1h4.25L13 4.75ZM8 12.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">{compact ? 'SmartAttend' : 'SmartAttend'}</div>
        {!compact ? <div className="text-xs text-slate-600">An-Najah National University</div> : null}
      </div>
    </div>
  )
}

