import { Link } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import Logo from '../brand/Logo'
import { RoleBadge } from '../ui/Badge'
import Button from '../ui/Button'

export default function AppNavbar() {
  const { currentUser, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/app" className="rounded-xl focus-visible:ring-2 focus-visible:ring-accent-500/60">
          <Logo compact />
        </Link>
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:flex">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</div>
                <div className="truncate text-xs text-slate-600">{currentUser.email}</div>
              </div>
              <RoleBadge role={currentUser.role} />
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

