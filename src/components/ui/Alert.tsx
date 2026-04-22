export default function Alert({
  title,
  message,
  tone = 'info',
}: {
  title: string
  message?: string
  tone?: 'info' | 'success' | 'warning' | 'danger'
}) {
  const styles: Record<string, string> = {
    info: 'border-brand-200 bg-brand-50 text-brand-950',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50 text-amber-950',
    danger: 'border-rose-200 bg-rose-50 text-rose-950',
  }
  return (
    <div className={['rounded-2xl border px-4 py-3', styles[tone]].join(' ')} role="status">
      <div className="text-sm font-semibold">{title}</div>
      {message ? <div className="mt-0.5 text-sm opacity-90">{message}</div> : null}
    </div>
  )
}

