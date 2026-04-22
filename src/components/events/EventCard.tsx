import { Link } from 'react-router-dom'
import type { Event } from '../../types/models'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate, formatTime } from '../../utils/format'

export default function EventCard({
  event,
  registered,
  registrationsCount,
}: {
  event: Event
  registered: boolean
  registrationsCount: number
}) {
  const full = registrationsCount >= event.capacity
  const closed = !!event.registrationClosed

  const tone = closed ? 'warning' : full ? 'danger' : registered ? 'success' : 'info'
  const status = closed ? 'Registration closed' : full ? 'Full' : registered ? 'Registered' : 'Open'

  const banner: Record<string, string> = {
    workshop: 'from-brand-950 via-brand-900 to-accent-600',
    seminar: 'from-slate-900 via-brand-950 to-brand-800',
    sports: 'from-brand-900 via-accent-600 to-emerald-600',
    career: 'from-brand-950 via-brand-800 to-amber-500',
    community: 'from-brand-900 via-emerald-700 to-accent-600',
  }

  return (
    <div className="card overflow-hidden">
      <div className={['h-20 bg-gradient-to-br', banner[event.bannerVariant ?? 'workshop']].join(' ')} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-900">{event.title}</div>
            <div className="mt-1 text-sm text-slate-600">
              {formatDate(event.date)} • {formatTime(event.time)} • {event.location}
            </div>
          </div>
          <Badge tone={tone}>{status}</Badge>
        </div>

        <div className="mt-3 text-sm text-slate-600">{event.description}</div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-600">
            {registrationsCount}/{event.capacity} registered
          </div>
          <Link to={`/app/student/events/${event.id}`}>
            <Button variant="secondary" size="sm">
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

