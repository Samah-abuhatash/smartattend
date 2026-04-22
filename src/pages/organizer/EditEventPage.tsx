import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import EventForm, { type EventDraft, validateEventDraft } from '../../components/events/EventForm'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import { useAuth } from '../../state/AuthContext'
import { useToast } from '../../state/ToastContext'

export default function EditEventPage() {
  const { eventId } = useParams()
  const { currentUser, events, updateEvent } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  const event = events.find((e) => e.id === eventId)
  const notAllowed = !event || !currentUser || currentUser.role !== 'organizer' || event.organizerId !== currentUser.id
  if (notAllowed) return <Navigate to="/app/organizer/dashboard" replace />

  const initial: EventDraft = useMemo(
    () => ({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      capacity: event.capacity,
      bannerVariant: event.bannerVariant ?? 'workshop',
      registrationClosed: !!event.registrationClosed,
    }),
    [event],
  )

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">Edit event</div>
            <div className="mt-1 text-sm text-slate-600">Update details and manage registration status.</div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/app/organizer/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <EventForm
            initial={initial}
            saveLabel="Save changes"
            onCancel={() => navigate('/app/organizer/dashboard')}
            onSave={(draft) => {
              const v = validateEventDraft(draft)
              if (!v.ok) {
                pushToast({ title: 'Please fix the form', message: v.message, tone: 'warning' })
                return v
              }
              const updated = updateEvent(event.id, {
                title: draft.title.trim(),
                date: draft.date,
                time: draft.time,
                location: draft.location.trim(),
                description: draft.description.trim(),
                capacity: draft.capacity,
                registrationClosed: !!draft.registrationClosed,
                bannerVariant: draft.bannerVariant,
              })
              if (!updated) return { ok: false as const, message: 'Unable to update this event.' }
              pushToast({ title: 'Event updated', tone: 'success' })
              return { ok: true as const }
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <Alert
              tone="info"
              title="Edit mode"
              message="Fields are pre-filled. Save changes to update local state (prototype)."
            />
            <div className="mt-4 rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Event ID</div>
              <div className="mt-1 font-mono text-xs">{event.id}</div>
            </div>
          </div>
          <div className="card-muted p-6">
            <div className="text-sm font-semibold text-slate-900">Notes</div>
            <div className="mt-1 text-sm text-slate-700">
              Closing registration will show a closed state to students and prevents new registrations.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

