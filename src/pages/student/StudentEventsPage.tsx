import { useMemo, useState } from 'react'
import EventCard from '../../components/events/EventCard'
import EmptyState from '../../components/ui/EmptyState'
import Input, { Label, Select } from '../../components/ui/Input'
import { useAuth } from '../../state/AuthContext'

type Filter = 'all' | 'open' | 'registered' | 'full' | 'closed'

export default function StudentEventsPage() {
  const { currentUser, events, registrations } = useAuth()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const byEventCount = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of registrations) map.set(r.eventId, (map.get(r.eventId) ?? 0) + 1)
    return map
  }, [registrations])

  const registeredSet = useMemo(() => {
    const set = new Set<string>()
    if (!currentUser) return set
    for (const r of registrations) {
      if (r.studentId === currentUser.id) set.add(r.eventId)
    }
    return set
  }, [currentUser, registrations])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return events
      .filter((e) => {
        if (!query) return true
        return (
          e.title.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
        )
      })
      .filter((e) => {
        if (filter === 'all') return true
        const count = byEventCount.get(e.id) ?? 0
        const isRegistered = registeredSet.has(e.id)
        const isFull = count >= e.capacity
        const isClosed = !!e.registrationClosed
        if (filter === 'registered') return isRegistered
        if (filter === 'full') return isFull
        if (filter === 'closed') return isClosed
        if (filter === 'open') return !isClosed && !isFull
        return true
      })
  }, [byEventCount, events, filter, q, registeredSet])

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-slate-900">Events</div>
            <div className="mt-1 text-sm text-slate-600">Browse available university events and activities.</div>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, location, keyword..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter">Filter</Label>
              <Select id="filter" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                <option value="all">All events</option>
                <option value="open">Open</option>
                <option value="registered">Registered</option>
                <option value="full">Full</option>
                <option value="closed">Registration closed</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              registered={registeredSet.has(e.id)}
              registrationsCount={byEventCount.get(e.id) ?? 0}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching events"
          message="Try adjusting your search or filter to find an event."
          actionLabel="Clear filters"
          onAction={() => {
            setQ('')
            setFilter('all')
          }}
        />
      )}
    </div>
  )
}

