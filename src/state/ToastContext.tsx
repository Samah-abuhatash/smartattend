import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ToastTone = 'success' | 'info' | 'warning' | 'danger'

export type Toast = {
  id: string
  title: string
  message?: string
  tone: ToastTone
}

type ToastContextValue = {
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function uid() {
  return `t_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = uid()
      const toast: Toast = { id, ...t }
      setToasts((prev) => [toast, ...prev].slice(0, 4))
      window.setTimeout(() => dismissToast(id), 4500)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts, pushToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'pointer-events-auto card px-4 py-3',
              t.tone === 'success' ? 'border-emerald-200 bg-emerald-50' : '',
              t.tone === 'info' ? 'border-brand-200 bg-brand-50' : '',
              t.tone === 'warning' ? 'border-amber-200 bg-amber-50' : '',
              t.tone === 'danger' ? 'border-rose-200 bg-rose-50' : '',
            ].join(' ')}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{t.title}</div>
                {t.message ? <div className="mt-0.5 text-sm text-slate-700">{t.message}</div> : null}
              </div>
              <button
                className="rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-white/60"
                onClick={() => dismissToast(t.id)}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

