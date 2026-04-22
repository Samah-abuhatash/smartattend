import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-sm'
  const variants: Record<Variant, string> = {
    primary: 'bg-brand-900 text-white hover:bg-brand-800 shadow-card',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-card',
  }
  return (
    <button className={[base, sizes, variants[variant], className].join(' ')} {...props}>
      {children}
    </button>
  )
}

