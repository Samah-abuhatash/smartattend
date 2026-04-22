import { Link, useLocation } from 'react-router-dom'
import Logo from '../brand/Logo'
import Button from '../ui/Button'

export default function PublicNavbar() {
  const { pathname } = useLocation()
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="rounded-xl focus-visible:ring-2 focus-visible:ring-accent-500/60">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant={pathname === '/auth' ? 'secondary' : 'primary'} size="sm">
              Login / Create account
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

