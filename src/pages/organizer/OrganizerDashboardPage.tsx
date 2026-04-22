import { Link } from 'react-router-dom'
import AttendanceChartPlaceholder from '../../components/charts/AttendanceChartPlaceholder'
import SummaryCard from '../../components/dashboard/SummaryCard'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import { useAuth } from '../../state/AuthContext'
import { formatDate, formatTime } from '../../utils/format'

export default function OrganizerDashboardPage() {
  const { currentUser, events, registrations, attendance } = useAuth()

  const myEvents = events.filter((e) => e.organizerId === currentUser?.id)

  const myEventIds = new Set(myEvents.map((e) => e.id))
  const myRegistrations = registrations.filter((r) => myEventIds.has(r.eventId))
  const myAttendanceCount = myRegistrations.filter((r) =>
    attendance.some((a) => a.registrationId === r.id && a.status === 'checked_in'),
  ).length

  const columns = [
    { key: 'title', header: 'Event' },
    { key: 'when', header: 'Date & time' },
    { key: 'location', header: 'Location' },
    { key: 'stats', header: 'Registrations / Attendance' },
    { key: 'actions', header: 'Actions', className: 'text-right' },
  ]

  const rows = myEvents.slice(0, 6).map((e) => {
    const regs = myRegistrations.filter((r) => r.eventId === e.id)
    const att = regs.filter((r) => attendance.some((a) => a.registrationId === r.id && a.status === 'checked_in')).length
    return {
      id: e.id,
      cells: {
        title: (
          <div className="min-w-0">
            <div className="truncate font-semibold">{e.title}</div>
            <div className="mt-0.5 text-xs text-slate-600">{e.description}</div>
          </div>
        ),
        when: (
          <div className="text-sm">
            <div className="font-semibold text-slate-900">{formatDate(e.date)}</div>
            <div className="text-slate-600">{formatTime(e.time)}</div>
          </div>
        ),
        location: <div className="text-slate-700">{e.location}</div>,
        stats: (
          <div className="text-slate-700">
            <div>
              <span className="font-semibold">{regs.length}</span> registered
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold">{att}</span> checked in
            </div>
          </div>
        ),
        actions: (
          <div className="flex justify-end gap-2">
            <Link to={`/app/organizer/events/${e.id}/edit`}>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </Link>
            <Link to={`/app/organizer/reports?eventId=${encodeURIComponent(e.id)}`}>
              <Button size="sm">View report</Button>
            </Link>
          </div>
        ),
      },
    }
  })

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">Organizer dashboard</div>
            <div className="mt-1 text-sm text-slate-600">
              Overview of your events, registrations, and attendance (simulated).
            </div>
          </div>
          <Link to="/app/organizer/events/new">
            <Button>Create event</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total events"
          value={`${myEvents.length}`}
          hint="Events created by you"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm13 8H6v10h14V10Z" />
            </svg>
          }
        />
        <SummaryCard
          label="Total registrations"
          value={`${myRegistrations.length}`}
          hint="Across your events"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0H5Z"
              />
            </svg>
          }
        />
        <SummaryCard
          label="Total attendance"
          value={`${myAttendanceCount}`}
          hint="Checked-in confirmations"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="m9 16.2-3.5-3.5L4 14.2l5 5L20 8.2 18.6 6.8 9 16.2Z"
              />
            </svg>
          }
        />
      </div>

      <AttendanceChartPlaceholder />

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">Recent events</div>
            <div className="mt-0.5 text-sm text-slate-600">Quick access to edit and reports.</div>
          </div>
          <Link to="/app/organizer/reports">
            <Button variant="ghost" size="sm">
              All reports
            </Button>
          </Link>
        </div>
        <Table
          columns={columns}
          rows={rows}
          empty={<div className="text-center text-slate-600">No events yet. Create your first event.</div>}
        />
      </div>
    </div>
  )
}

