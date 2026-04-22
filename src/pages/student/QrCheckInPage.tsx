import { useMemo, useState } from 'react'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input, { Label, Select } from '../../components/ui/Input'
import { useAuth } from '../../state/AuthContext'
import { useToast } from '../../state/ToastContext'
import { formatDate, formatTime } from '../../utils/format'

export default function QrCheckInPage() {
  const { currentUser, events, registrations, attendance, makeQrPayload, checkInWithQr } = useAuth()
  const { pushToast } = useToast()

  const myRegs = useMemo(() => {
    if (!currentUser) return []
    return registrations.filter((r) => r.studentId === currentUser.id)
  }, [currentUser, registrations])

  const myEvents = useMemo(() => {
    const map = new Map(events.map((e) => [e.id, e]))
    return myRegs.map((r) => map.get(r.eventId)).filter(Boolean)
  }, [events, myRegs])

  const [selectedEventId, setSelectedEventId] = useState<string>(myEvents[0]?.id ?? '')
  const [payload, setPayload] = useState('')
  const [result, setResult] = useState<
    null | 'success' | 'invalid_qr' | 'expired_qr' | 'not_registered' | 'already_checked_in'
  >(null)
  const [details, setDetails] = useState<string>('')

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const alreadyCheckedIn = useMemo(() => {
    if (!currentUser || !selectedEvent) return false
    const reg = registrations.find((r) => r.eventId === selectedEvent.id && r.studentId === currentUser.id)
    if (!reg) return false
    return attendance.some((a) => a.registrationId === reg.id && a.status === 'checked_in')
  }, [attendance, currentUser, registrations, selectedEvent])

  const statusCard =
    result === 'success' ? (
      <Alert tone="success" title="Check‑in successful" message={details} />
    ) : result === 'already_checked_in' ? (
      <Alert tone="warning" title="Already checked in" message={details} />
    ) : result === 'not_registered' ? (
      <Alert tone="danger" title="Not registered" message={details} />
    ) : result === 'expired_qr' ? (
      <Alert tone="warning" title="Expired QR" message={details} />
    ) : result === 'invalid_qr' ? (
      <Alert tone="danger" title="Invalid QR" message={details} />
    ) : (
      <Alert tone="info" title="Scanner ready" message="Use the mock controls to simulate scanning and validation states." />
    )

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-xl font-semibold text-slate-900">QR Attendance Check‑In</div>
        <div className="mt-1 text-sm text-slate-600">
          This is a simulated scanner UI. It validates mocked QR payloads and updates attendance state locally.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Scanner preview (mock)</div>
              <div className="mt-1 text-sm text-slate-600">Camera access is not used in this prototype.</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-surface-50 px-3 py-2 text-xs font-semibold text-slate-700">
              Status: Ready
            </div>
          </div>

          <div className="mt-5 grid place-items-center rounded-3xl border border-dashed border-slate-300 bg-white p-8">
            <div className="grid place-items-center rounded-3xl bg-surface-50 p-8">
              <div className="grid h-40 w-64 place-items-center rounded-2xl border border-slate-200 bg-white">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-900">QR frame</div>
                  <div className="mt-1 text-xs text-slate-600">Align code here (placeholder)</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <div className="h-2 w-2 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="event">Registered event (for demo)</Label>
              <Select
                id="event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={!myEvents.length}
              >
                {myEvents.length ? null : <option value="">No registrations yet</option>}
                {myEvents.map((e) => (
                  <option key={e!.id} value={e!.id}>
                    {e!.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payload">QR payload</Label>
              <Input
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="SA|eventId|studentId|expIso"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!currentUser || !selectedEvent}
              onClick={() => {
                if (!currentUser || !selectedEvent) return
                const p = makeQrPayload(selectedEvent.id, currentUser.id)
                setPayload(p)
                pushToast({ title: 'Generated QR payload', tone: 'info' })
              }}
            >
              Generate valid QR (demo)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const exp = new Date(Date.now() - 2 * 60 * 1000).toISOString()
                setPayload(`SA|${selectedEvent?.id ?? 'e-000'}|${currentUser?.id ?? 'u-000'}|${exp}`)
                pushToast({ title: 'Generated expired QR', tone: 'warning' })
              }}
            >
              Generate expired QR
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPayload('INVALID|PAYLOAD')
                pushToast({ title: 'Generated invalid QR', tone: 'danger' })
              }}
            >
              Generate invalid QR
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const r = checkInWithQr(payload)
                if (r.status === 'success') {
                  setResult('success')
                  setDetails(`Attendance confirmed at ${new Date(r.checkedInAt).toLocaleString()}.`)
                  pushToast({ title: 'Check‑in successful', tone: 'success' })
                } else if (r.status === 'already_checked_in') {
                  setResult('already_checked_in')
                  setDetails(`You already checked in at ${new Date(r.checkedInAt).toLocaleString()}.`)
                  pushToast({ title: 'Duplicate check‑in prevented', tone: 'warning' })
                } else if (r.status === 'not_registered') {
                  setResult('not_registered')
                  setDetails('This QR belongs to an event you are not registered for.')
                  pushToast({ title: 'Not registered', tone: 'danger' })
                } else if (r.status === 'expired_qr') {
                  setResult('expired_qr')
                  setDetails('This QR code is expired. Please request a new one.')
                  pushToast({ title: 'Expired QR', tone: 'warning' })
                } else {
                  setResult('invalid_qr')
                  setDetails('The scanned QR payload is invalid or malformed.')
                  pushToast({ title: 'Invalid QR', tone: 'danger' })
                }
              }}
            >
              Validate & check‑in
            </Button>
          </div>

          {selectedEvent ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Selected event</div>
              <div className="mt-1">
                {selectedEvent.title} • {formatDate(selectedEvent.date)} • {formatTime(selectedEvent.time)}
              </div>
              <div className="mt-1 text-slate-600">
                Current check‑in status: <span className="font-semibold">{alreadyCheckedIn ? 'Checked in' : 'Not checked in'}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="card p-6">{statusCard}</div>
          <div className="card-muted p-6">
            <div className="text-sm font-semibold text-slate-900">Supported states</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
              <li>Success</li>
              <li>Invalid QR</li>
              <li>Expired QR</li>
              <li>Not registered</li>
              <li>Already checked in</li>
            </ul>
            <div className="mt-4 text-xs text-slate-600">
              QR format: <span className="font-semibold">SA|eventId|studentId|expIso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

