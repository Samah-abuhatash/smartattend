import React from 'react'

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
      {children}
    </label>
  )
}

export default function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm',
        'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function Textarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm',
        'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function Select({
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm',
        'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

export function HelperText({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'danger' }) {
  return <div className={tone === 'danger' ? 'text-sm text-rose-700' : 'text-sm text-slate-600'}>{children}</div>
}

