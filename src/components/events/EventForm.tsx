import { useMemo, useState } from 'react'
import type { Event } from '../../types/models'
import Button from '../ui/Button'
import Input, { HelperText, Label, Select, Textarea } from '../ui/Input'

export type EventDraft = {
  title: string
  date: string
  time: string
  location: string
  description: string
  capacity: number
  registrationClosed?: boolean
  bannerVariant?: Event['bannerVariant']
}

export default function EventForm({
  initial,
  onCancel,
  onSave,
  saveLabel,
}: {
  initial: EventDraft
  onCancel: () => void
  onSave: (draft: EventDraft) => { ok: true } | { ok: false; message: string }
  saveLabel: string
}) {
  const [draft, setDraft] = useState<EventDraft>(initial)
  const [error, setError] = useState<string | null>(null)

  const capacityStr = useMemo(() => String(draft.capacity ?? ''), [draft.capacity])

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        const res = onSave(draft)
        if (!res.ok) setError(res.message)
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Event title</Label>
        <Input
          id="title"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="e.g., Research Seminar: Writing & Publishing"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={draft.location}
          onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
          placeholder="e.g., Engineering Building — Hall B"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Write a clear description and expected outcomes for attendees..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2 sm:col-span-1">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            inputMode="numeric"
            value={capacityStr}
            onChange={(e) => setDraft((d) => ({ ...d, capacity: Number(e.target.value || 0) }))}
            placeholder="e.g., 80"
          />
          <HelperText>Seat limit for registrations.</HelperText>
        </div>
        <div className="grid gap-2 sm:col-span-1">
          <Label htmlFor="banner">Style</Label>
          <Select
            id="banner"
            value={draft.bannerVariant ?? 'workshop'}
            onChange={(e) => setDraft((d) => ({ ...d, bannerVariant: e.target.value as Event['bannerVariant'] }))}
          >
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="career">Career</option>
            <option value="sports">Sports</option>
            <option value="community">Community</option>
          </Select>
        </div>
        <div className="grid gap-2 sm:col-span-1">
          <Label htmlFor="closed">Registration</Label>
          <Select
            id="closed"
            value={draft.registrationClosed ? 'closed' : 'open'}
            onChange={(e) => setDraft((d) => ({ ...d, registrationClosed: e.target.value === 'closed' }))}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </Select>
        </div>
      </div>

      {error ? <HelperText tone="danger">{error}</HelperText> : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit">{saveLabel}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">Validation</div>
        <div className="mt-1">- Title, date, time, and location are required.</div>
        <div>- Capacity must be a positive number.</div>
      </div>
    </form>
  )
}

export function validateEventDraft(d: EventDraft): { ok: true } | { ok: false; message: string } {
  if (!d.title.trim()) return { ok: false, message: 'Event title is required.' }
  if (!d.date) return { ok: false, message: 'Event date is required.' }
  if (!d.time) return { ok: false, message: 'Event time is required.' }
  if (!d.location.trim()) return { ok: false, message: 'Event location is required.' }
  if (!d.description.trim()) return { ok: false, message: 'Event description is required.' }
  if (!Number.isFinite(d.capacity) || d.capacity <= 0) return { ok: false, message: 'Capacity must be greater than 0.' }
  return { ok: true }
}

