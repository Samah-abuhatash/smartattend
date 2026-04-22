export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatTime(time: string) {
  const [hh, mm] = time.split(':').map((x) => Number(x))
  const d = new Date()
  d.setHours(hh || 0, mm || 0, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

