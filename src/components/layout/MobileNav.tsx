import { NavLink } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'

function Tab({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold',
          isActive ? 'bg-brand-950 text-white' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function MobileNav() {
  const { currentUser } = useAuth()
  if (!currentUser) return null

  const tabs =
    currentUser.role === 'student'
      ? [
          {
            to: '/app/student/events',
            label: 'Events',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm13 8H6v10h14V10Z" />
              </svg>
            ),
          },
          {
            to: '/app/student/check-in',
            label: 'Check-in',
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 4h6v2H6v4H4V4Zm14 0h2v6h-2V6h-4V4h4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Zm-2-4h-4v4h4v-4Z" />
              </svg>
            ),
          },
        ]
      : currentUser.role === 'organizer'
        ? [
            {
              to: '/app/organizer/dashboard',
              label: 'Dashboard',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M4 4h7v9H4V4Zm9 0h7v5h-7V4ZM4 15h7v5H4v-5Zm9-4h7v9h-7v-9Z" />
                </svg>
              ),
            },
            {
              to: '/app/organizer/events/new',
              label: 'Create',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
                </svg>
              ),
            },
            {
              to: '/app/organizer/reports',
              label: 'Reports',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 14h2V7H7v10Zm4 0h2V11h-2v6Zm4 0h2V9h-2v8Z" />
                </svg>
              ),
            },
          ]
        : [
            {
              to: '/app/admin/users',
              label: 'Users',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0H5Z" />
                </svg>
              ),
            },
          ]

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-card lg:hidden">
      <div className="flex gap-2">{tabs.map((t) => <Tab key={t.to} to={t.to} label={t.label} icon={t.icon} />)}</div>
    </nav>
  )
}

