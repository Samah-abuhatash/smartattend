import { Link, Navigate, useParams } from 'react-router-dom'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useAuth } from '../../state/AuthContext'
import { useToast } from '../../state/ToastContext'
import { formatDate, formatTime } from '../../utils/format'

export default function EventDetailsPage() {
  const { eventId } = useParams()
  const { currentUser, events, users, registrations, registerForEvent } = useAuth()
  const { pushToast } = useToast()

  const event = events.find((e) => e.id === eventId)
  if (!event) return <Navigate to="/app/student/events" replace />
  if (!currentUser) return <Navigate to="/auth" replace />

  const organizer = users.find((u) => u.id === event.organizerId)
  const registrationsCount = registrations.filter((r) => r.eventId === event.id).length
  const isRegistered = registrations.some((r) => r.eventId === event.id && r.studentId === currentUser.id)
  const isFull = registrationsCount >= event.capacity
  const isClosed = !!event.registrationClosed

  const canRegister = !isRegistered && !isFull && !isClosed

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-accent-600 px-6 py-7 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold opacity-90">Event details</div>
              <div className="mt-1 text-balance text-2xl font-semibold">{event.title}</div>
              <div className="mt-2 text-sm opacity-90">
                {formatDate(event.date)} • {formatTime(event.time)} • {event.location}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isRegistered ? <Badge tone="success">Registered</Badge> : null}
              {isClosed ? <Badge tone="warning">Registration closed</Badge> : null}
              {isFull ? <Badge tone="danger">Full</Badge> : null}
              {!isFull && !isClosed ? <Badge tone="info">Open</Badge> : null}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="text-sm font-semibold text-slate-900">About this event</div>
              <div className="mt-2 text-sm leading-6 text-slate-700">{event.description}</div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organizer</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{organizer?.name ?? 'University Office'}</div>
                  <div className="mt-0.5 text-sm text-slate-600">{organizer?.email ?? '—'}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {registrationsCount}/{event.capacity} registered
                  </div>
                  <div className="mt-0.5 text-sm text-slate-600">
                    {isFull ? 'No seats remaining.' : `${event.capacity - registrationsCount} seats remaining.`}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {isRegistered ? (
                <Alert
                  tone="success"
                  title="You’re registered"
                  message="Your registration is confirmed. On event day, use QR check‑in to confirm attendance."
                />
              ) : isClosed ? (
                <Alert
                  tone="warning"
                  title="Registration closed"
                  message="This event is not accepting new registrations."
                />
              ) : isFull ? (
                <Alert tone="danger" title="Event full" message="Capacity reached. Please check other events." />
              ) : (
                <Alert
                  tone="info"
                  title="Registration open"
                  message="Click Register to reserve your spot. Duplicate registrations are prevented."
                />
              )}

              <div className="card p-5">
                <div className="text-sm font-semibold text-slate-900">Actions</div>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    disabled={!canRegister}
                    onClick={() => {
                      const res = registerForEvent(event.id)
                      if (res.ok) pushToast({ title: 'Registered successfully', tone: 'success' })
                      else pushToast({ title: 'Registration unavailable', message: res.message, tone: 'warning' })
                    }}
                  >
                    {isRegistered ? 'Already registered' : isFull ? 'Event full' : isClosed ? 'Closed' : 'Register'}
                  </Button>
                  <Link to="/app/student/events">
                    <Button variant="secondary">Back to events</Button>
                  </Link>
                </div>
                <div className="mt-4 text-xs text-slate-600">
                  Note: This is a frontend prototype. Registration state is stored locally in your browser.
                </div>
              </div>

              <div className="card-muted p-5">
                <div className="text-sm font-semibold text-slate-900">Check‑in reminder</div>
                <div className="mt-1 text-sm text-slate-700">
                  On event day, open the QR check‑in page. If you are not registered, the system will show a friendly warning.
                </div>
                <div className="mt-3">
                  <Link to="/app/student/check-in">
                    <Button variant="ghost" size="sm">
                      Go to QR check‑in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

