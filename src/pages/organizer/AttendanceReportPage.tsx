import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SummaryCard from '../../components/dashboard/SummaryCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Input, { Label, Select } from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import { useAuth } from '../../state/AuthContext'
import { formatDate, formatTime } from '../../utils/format'

export default function AttendanceReportPage() {
  const { currentUser, events, users, registrations, attendance, buildReport, exportReportPlaceholder } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const preselect = params.get('eventId') ?? ''

  const myEvents = useMemo(() => events.filter((e) => e.organizerId === currentUser?.id), [currentUser?.id, events])
  const [eventId, setEventId] = useState<string>(preselect || myEvents[0]?.id || '')
  const [q, setQ] = useState('')

  const selectedEvent = myEvents.find((e) => e.id === eventId)
  const report = selectedEvent ? buildReport(selectedEvent.id) : null

  const attendeeRows = useMemo(() => {
    if (!selectedEvent) return []
    const regs = registrations.filter((r) => r.eventId === selectedEvent.id)
    const query = q.trim().toLowerCase()

    return regs
      .map((r) => {
        const user = users.find((u) => u.id === r.studentId)
        const att = attendance.find((a) => a.registrationId === r.id)
        const checked = att?.status === 'checked_in'
        return {
          id: r.id,
          name: user?.name ?? 'Unknown student',
          email: user?.email ?? '—',
          status: checked ? 'Checked in' : 'Not checked in',
          checkedInAt: checked && att?.checkedInAt ? new Date(att.checkedInAt).toLocaleString() : '—',
        }
      })
      .filter((x) => {
        if (!query) return true
        return x.name.toLowerCase().includes(query) || x.email.toLowerCase().includes(query) || x.status.toLowerCase().includes(query)
      })
  }, [attendance, q, registrations, selectedEvent, users])

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
    { key: 'checkedInAt', header: 'Checked-in at' },
  ]

  const rows = attendeeRows.map((a) => ({
    id: a.id,
    cells: {
      name: <div className="font-semibold">{a.name}</div>,
      email: <div className="text-slate-700">{a.email}</div>,
      status: <Badge tone={a.status === 'Checked in' ? 'success' : 'neutral'}>{a.status}</Badge>,
      checkedInAt: <div className="text-slate-700">{a.checkedInAt}</div>,
    },
  }))

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">Attendance reports</div>
            <div className="mt-1 text-sm text-slate-600">Select an event to view registrations and check‑in status.</div>
          </div>
          <Link to="/app/organizer/dashboard">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="event">Event selector</Label>
              <Select id="event" value={eventId} onChange={(e) => setEventId(e.target.value)} disabled={!myEvents.length}>
                {myEvents.length ? null : <option value="">No events available</option>}
                {myEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="search">Search attendees</Label>
              <Input id="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, status..." />
            </div>
          </div>

          {selectedEvent ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{selectedEvent.title}</div>
              <div className="mt-1 text-slate-600">
                {formatDate(selectedEvent.date)} • {formatTime(selectedEvent.time)} • {selectedEvent.location}
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            {selectedEvent ? (
              <Table
                columns={columns}
                rows={rows}
                empty={<div className="text-center text-slate-600">No registrations for this event yet.</div>}
              />
            ) : (
              <EmptyState
                title="No event selected"
                message="Create an event first, then come back to view attendance reports."
                actionLabel="Create event"
                onAction={() => navigate('/app/organizer/events/new')}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4">
            <SummaryCard label="Registrations" value={report ? `${report.registrations}` : '—'} hint="Total registrations" />
            <SummaryCard label="Attendance" value={report ? `${report.attendance}` : '—'} hint="Checked-in attendees" />
            <SummaryCard
              label="Capacity"
              value={report ? `${report.capacity}` : '—'}
              hint={report ? `${Math.max(0, report.capacity - report.registrations)} seats remaining` : '—'}
            />
          </div>

          <div className="card p-6">
            <div className="text-sm font-semibold text-slate-900">Export</div>
            <div className="mt-1 text-sm text-slate-600">Placeholder button (no real export in frontend-only mode).</div>
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  exportReportPlaceholder()
                }}
                disabled={!selectedEvent}
              >
                Export report (placeholder)
              </Button>
            </div>
          </div>

          <div className="card-muted p-6">
            <div className="text-sm font-semibold text-slate-900">Empty state behavior</div>
            <div className="mt-1 text-sm text-slate-700">
              If an event has no registrations, the table shows an empty message instead of a blank area.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

