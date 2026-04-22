import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'
import Button from '../components/ui/Button'
import Input, { HelperText, Label } from '../components/ui/Input'

type Mode = 'login' | 'register'

const demoAccounts = [
  { label: 'Student demo', email: 'lina.qasem@najah.edu', password: 'Password123!' },
  { label: 'Organizer demo', email: 'ahmad.saleh@najah.edu', password: 'Password123!' },
  { label: 'Admin demo', email: 'admin@najah.edu', password: 'Password123!' },
]

export default function AuthPage() {
  const { currentUser, login, registerAccount } = useAuth()
  const { pushToast } = useToast()

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const headline = useMemo(() => (mode === 'login' ? 'Welcome back' : 'Create your student account'), [mode])

  if (currentUser) return <Navigate to="/app" replace />

  return (
    <div className="bg-white">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-accent-600 px-7 py-8 text-white">
              <div className="text-sm font-semibold opacity-90">SmartAttend</div>
              <div className="mt-2 text-2xl font-semibold">Login & Account Access</div>
              <div className="mt-2 text-sm opacity-90">
                Use your An‑Najah email. This is a frontend‑only prototype with demo accounts.
              </div>
            </div>
            <div className="p-7">
              <div className="text-sm font-semibold text-slate-900">Demo accounts</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {demoAccounts.map((a) => (
                  <button
                    key={a.label}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm hover:bg-slate-50"
                    onClick={() => {
                      const res = login(a.email, a.password)
                      if (res.ok) {
                        pushToast({ title: `Signed in as ${a.label}`, tone: 'success' })
                      } else {
                        pushToast({ title: 'Login failed', message: res.message, tone: 'danger' })
                      }
                    }}
                  >
                    <div className="font-semibold text-slate-900">{a.label}</div>
                    <div className="mt-0.5 truncate text-xs text-slate-600">{a.email}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
                Password for demos: <span className="font-semibold">Password123!</span>
              </div>
            </div>
          </div>

          <div className="card p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{headline}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {mode === 'login'
                    ? 'Sign in to browse events and manage attendance.'
                    : 'Registration creates a student account (mocked).'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant={mode === 'login' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('login')}>
                  Login
                </Button>
                <Button
                  variant={mode === 'register' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setMode('register')}
                >
                  Create
                </Button>
              </div>
            </div>

            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                if (mode === 'login') {
                  const res = login(email, password)
                  if (!res.ok) setError(res.message)
                  else pushToast({ title: 'Welcome back', tone: 'success' })
                } else {
                  const res = registerAccount({ name, email, password })
                  if (!res.ok) setError(res.message)
                  else pushToast({ title: 'Account created', message: 'You are now signed in as a student.', tone: 'success' })
                }
              }}
            >
              {mode === 'register' ? (
                <div className="grid gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Sara Ahmad" />
                </div>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor="email">University email</Label>
                <Input
                  id="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@najah.edu"
                />
                <HelperText>Use your official An‑Najah email address.</HelperText>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error ? <HelperText tone="danger">{error}</HelperText> : null}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setName('')
                    setEmail('')
                    setPassword('')
                    setError(null)
                  }}
                >
                  Clear
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Validation notes</div>
                <div className="mt-1">
                  - Email must end with <span className="font-semibold">@najah.edu</span>.
                </div>
                <div>- Password must be at least 8 characters.</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

