import React, { useEffect } from 'react'

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean
  title: string
  description?: string
  children: React.ReactNode
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-ink-950/40" onClick={onClose} aria-label="Close modal" />
      <div className="relative w-full max-w-lg">
        <div className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-semibold text-slate-900">{title}</div>
              {description ? <div className="mt-1 text-sm text-slate-600">{description}</div> : null}
            </div>
            <button
              className="rounded-xl px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
              onClick={onClose}
              aria-label="Close"
            >
              Close
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

