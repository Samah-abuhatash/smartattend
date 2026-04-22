import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EventForm, { type EventDraft, validateEventDraft } from '../../components/events/EventForm'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import { useAuth } from '../../state/AuthContext'
import { useToast } from '../../state/ToastContext'

export default function CreateEventPage() {
  const { createEvent } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  const [savedId, setSavedId] = useState<string | null>(null)

  const initial: EventDraft = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    capacity: 50,
    bannerVariant: 'workshop',
    registrationClosed: false,
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">Create event</div>
            <div className="mt-1 text-sm text-slate-600">Build an event with clear details, capacity, and status.</div>
          </div>
          <Link to="/app/organizer/dashboard">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <EventForm
            initial={initial}
            saveLabel="Save event"
            onCancel={() => navigate('/app/organizer/dashboard')}
            onSave={(draft) => {
              const v = validateEventDraft(draft)
              if (!v.ok) {
                pushToast({ title: 'Please fix the form', message: v.message, tone: 'warning' })
                return v
              }
              const created = createEvent({
                title: draft.title.trim(),
                date: draft.date,
                time: draft.time,
                location: draft.location.trim(),
                description: draft.description.trim(),
                capacity: draft.capacity,
                registrationClosed: !!draft.registrationClosed,
                bannerVariant: draft.bannerVariant,
              })
              setSavedId(created.id)
              pushToast({ title: 'Event created', tone: 'success' })
              return { ok: true }
            }}
          />
        </div>

        <div className="space-y-4">
          {savedId ? (
            <div className="card p-6">
              <Alert
                tone="success"
                title="Saved"
                message="Event saved successfully. QR preview below is a placeholder for backend-generated QR codes."
              />
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">QR code preview (placeholder)</div>
                <div className="mt-2 grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-surface-50 p-6">
                  <div className="grid h-32 w-32 place-items-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700">
                    QR
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  Event ID: <span className="font-semibold">{savedId}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/app/organizer/events/${savedId}/edit`}>
                  <Button variant="secondary" size="sm">
                    Edit event
                  </Button>
                </Link>
                <Link to={`/app/organizer/reports?eventId=${encodeURIComponent(savedId)}`}>
                  <Button size="sm">View report</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="card-muted p-6">
              <div className="text-sm font-semibold text-slate-900">After saving</div>
              <div className="mt-1 text-sm text-slate-700">
                You’ll see a QR preview placeholder and quick actions to edit or view reports.
              </div>
            </div>
          )}

          <div className="card-muted p-6">
            <div className="text-sm font-semibold text-slate-900">Organizer tips</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
              <li>Use clear locations (building + room/hall).</li>
              <li>Keep descriptions concise and outcome-focused.</li>
              <li>Close registrations if capacity is limited.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

