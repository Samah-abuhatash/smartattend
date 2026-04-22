import { NavLink } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'

function Item({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition',
          isActive ? 'bg-brand-950 text-white shadow-card' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { currentUser } = useAuth()
  if (!currentUser) return null

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="card p-3">
        <div className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Navigation
        </div>

        <div className="flex flex-col gap-1">
          {currentUser.role === 'student' ? (
            <>
              <Item
                to="/app/student/events"
                label="Browse events"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5a2 2 0 0 0-.586-1.414l-3.5-3.5A2 2 0 0 0 13.5 2H7Zm6 1.75V8a1 1 0 0 0 1 1h4.25L13 3.75ZM8 12.5a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 12.5Zm0 3a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 15.5Z"
                    />
                  </svg>
                }
              />
              <Item
                to="/app/student/check-in"
                label="QR check-in"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M4 4h6v2H6v4H4V4Zm14 0h2v6h-2V6h-4V4h4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Zm-2-4h-4v4h4v-4Z"
                    />
                  </svg>
                }
              />
            </>
          ) : null}

          {currentUser.role === 'organizer' ? (
            <>
              <Item
                to="/app/organizer/dashboard"
                label="Dashboard"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M4 4h7v9H4V4Zm9 0h7v5h-7V4ZM4 15h7v5H4v-5Zm9-4h7v9h-7v-9Z"
                    />
                  </svg>
                }
              />
              <Item
                to="/app/organizer/events/new"
                label="Create event"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"
                    />
                  </svg>
                }
              />
              <Item
                to="/app/organizer/reports"
                label="Attendance reports"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 14h2V7H7v10Zm4 0h2V11h-2v6Zm4 0h2V9h-2v8Z"
                    />
                  </svg>
                }
              />
            </>
          ) : null}

          {currentUser.role === 'admin' ? (
            <>
              <Item
                to="/app/admin/users"
                label="User management"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0H5Zm14-9h-2V9h-3V7h3V4h2v3h3v2h-3v3Z"
                    />
                  </svg>
                }
              />
            </>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

