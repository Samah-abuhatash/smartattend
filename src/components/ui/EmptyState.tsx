import Button from './Button'

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="card p-7 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface-100 text-brand-900">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 14h-2v-2h2v2Zm0-4h-2V6h2v6Z"
          />
        </svg>
      </div>
      <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{message}</div>
      {actionLabel && onAction ? (
        <div className="mt-5 flex justify-center">
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

