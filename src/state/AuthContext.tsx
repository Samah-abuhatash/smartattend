import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedAttendance, seedEvents, seedRegistrations, seedUsers, universityEmailRegex } from '../data/mock'
import type { Attendance, Event, Registration, Report, User, UserRole } from '../types/models'
import { loadJson, saveJson } from '../utils/storage'

type CheckInResult =
  | { status: 'success'; eventId: string; checkedInAt: string }
  | { status: 'invalid_qr' }
  | { status: 'expired_qr' }
  | { status: 'not_registered' }
  | { status: 'already_checked_in'; checkedInAt: string }

type AuthContextValue = {
  currentUser: User | null
  users: User[]
  events: Event[]
  registrations: Registration[]
  attendance: Attendance[]

  login: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  registerAccount: (args: { name: string; email: string; password: string }) => { ok: true } | { ok: false; message: string }
  logout: () => void

  createEvent: (e: Omit<Event, 'id' | 'organizerId'>) => Event
  updateEvent: (eventId: string, patch: Partial<Omit<Event, 'id' | 'organizerId'>>) => Event | null

  registerForEvent: (eventId: string) => { ok: true } | { ok: false; message: string }

  buildReport: (eventId: string) => Report | null
  exportReportPlaceholder: () => void

  makeQrPayload: (eventId: string, studentId: string) => string
  checkInWithQr: (payload: string) => CheckInResult

  adminUpdateUserRole: (userId: string, role: UserRole) => void
  adminToggleUserStatus: (userId: string) => void
  adminDeleteUser: (userId: string) => void
}

const LS = {
  users: 'smartattend.users.v1',
  events: 'smartattend.events.v1',
  registrations: 'smartattend.registrations.v1',
  attendance: 'smartattend.attendance.v1',
  session: 'smartattend.session.v1',
} as const

type Session = { userId: string } | null

const AuthContext = createContext<AuthContextValue | null>(null)

function nowIso() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function parseQr(payload: string): { ok: true; eventId: string; studentId: string; expIso: string } | { ok: false } {
  // Format: SA|<eventId>|<studentId>|<expIso>
  const parts = payload.trim().split('|')
  if (parts.length !== 4) return { ok: false }
  const [tag, eventId, studentId, expIso] = parts
  if (tag !== 'SA') return { ok: false }
  if (!eventId || !studentId || !expIso) return { ok: false }
  if (Number.isNaN(Date.parse(expIso))) return { ok: false }
  return { ok: true, eventId, studentId, expIso }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadJson<User[]>(LS.users, seedUsers))
  const [events, setEvents] = useState<Event[]>(() => loadJson<Event[]>(LS.events, seedEvents))
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    loadJson<Registration[]>(LS.registrations, seedRegistrations),
  )
  const [attendance, setAttendance] = useState<Attendance[]>(() => loadJson<Attendance[]>(LS.attendance, seedAttendance))
  const [session, setSession] = useState<Session>(() => loadJson<Session>(LS.session, null))

  useEffect(() => saveJson(LS.users, users), [users])
  useEffect(() => saveJson(LS.events, events), [events])
  useEffect(() => saveJson(LS.registrations, registrations), [registrations])
  useEffect(() => saveJson(LS.attendance, attendance), [attendance])
  useEffect(() => saveJson(LS.session, session), [session])

  const currentUser = useMemo(() => {
    if (!session) return null
    return users.find((u) => u.id === session.userId) ?? null
  }, [session, users])

  const login = useCallback(
    (email: string, password: string) => {
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!user) return { ok: false as const, message: 'No account found for this university email.' }
      if (user.status !== 'active') return { ok: false as const, message: 'This account is disabled. Please contact support.' }
      if (user.password !== password) return { ok: false as const, message: 'Incorrect password. Please try again.' }
      setSession({ userId: user.id })
      return { ok: true as const }
    },
    [users],
  )

  const registerAccount = useCallback(
    (args: { name: string; email: string; password: string }) => {
      const name = args.name.trim()
      const email = args.email.trim().toLowerCase()
      const password = args.password
      if (name.length < 3) return { ok: false as const, message: 'Please enter your full name.' }
      if (!universityEmailRegex.test(email)) return { ok: false as const, message: 'Please use your @najah.edu email.' }
      if (password.length < 8) return { ok: false as const, message: 'Password must be at least 8 characters.' }
      if (users.some((u) => u.email.toLowerCase() === email)) return { ok: false as const, message: 'An account with this email already exists.' }

      const newUser: User = {
        id: uid('u-stu'),
        name,
        email,
        role: 'student',
        password,
        status: 'active',
      }
      setUsers((prev) => [newUser, ...prev])
      setSession({ userId: newUser.id })
      return { ok: true as const }
    },
    [users],
  )

  const logout = useCallback(() => setSession(null), [])

  const createEvent = useCallback(
    (e: Omit<Event, 'id' | 'organizerId'>) => {
      if (!currentUser || currentUser.role !== 'organizer') {
        throw new Error('Only organizers can create events.')
      }
      const created: Event = { ...e, id: uid('e'), organizerId: currentUser.id }
      setEvents((prev) => [created, ...prev])
      return created
    },
    [currentUser],
  )

  const updateEvent = useCallback(
    (eventId: string, patch: Partial<Omit<Event, 'id' | 'organizerId'>>) => {
      if (!currentUser || currentUser.role !== 'organizer') return null
      let updated: Event | null = null
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e
          if (e.organizerId !== currentUser.id) return e
          updated = { ...e, ...patch }
          return updated
        }),
      )
      return updated
    },
    [currentUser],
  )

  const registerForEvent = useCallback(
    (eventId: string) => {
      if (!currentUser || currentUser.role !== 'student') return { ok: false as const, message: 'Please log in as a student.' }
      const ev = events.find((e) => e.id === eventId)
      if (!ev) return { ok: false as const, message: 'Event not found.' }
      if (ev.registrationClosed) return { ok: false as const, message: 'Registration is closed for this event.' }
      const already = registrations.some((r) => r.eventId === eventId && r.studentId === currentUser.id)
      if (already) return { ok: false as const, message: 'You are already registered for this event.' }
      const count = registrations.filter((r) => r.eventId === eventId).length
      if (count >= ev.capacity) return { ok: false as const, message: 'This event is currently full.' }
      const reg: Registration = { id: uid('r'), eventId, studentId: currentUser.id, createdAt: nowIso() }
      setRegistrations((prev) => [reg, ...prev])
      return { ok: true as const }
    },
    [currentUser, events, registrations],
  )

  const buildReport = useCallback(
    (eventId: string) => {
      const ev = events.find((e) => e.id === eventId)
      if (!ev) return null
      const regs = registrations.filter((r) => r.eventId === eventId)
      const att = regs.filter((r) => attendance.some((a) => a.registrationId === r.id && a.status === 'checked_in')).length
      return { eventId, registrations: regs.length, attendance: att, capacity: ev.capacity }
    },
    [attendance, events, registrations],
  )

  const exportReportPlaceholder = useCallback(() => {
    // Frontend-only placeholder: no file export performed here.
  }, [])

  const makeQrPayload = useCallback((eventId: string, studentId: string) => {
    const exp = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    return `SA|${eventId}|${studentId}|${exp}`
  }, [])

  const checkInWithQr = useCallback(
    (payload: string): CheckInResult => {
      const parsed = parseQr(payload)
      if (!parsed.ok) return { status: 'invalid_qr' }
      const expMs = Date.parse(parsed.expIso)
      if (Date.now() > expMs) return { status: 'expired_qr' }

      const reg = registrations.find((r) => r.eventId === parsed.eventId && r.studentId === parsed.studentId)
      if (!reg) return { status: 'not_registered' }

      const existing = attendance.find((a) => a.registrationId === reg.id)
      if (existing?.status === 'checked_in') {
        return { status: 'already_checked_in', checkedInAt: existing.checkedInAt ?? nowIso() }
      }

      const checkedInAt = nowIso()
      setAttendance((prev) => {
        const idx = prev.findIndex((a) => a.registrationId === reg.id)
        if (idx >= 0) {
          const copy = [...prev]
          copy[idx] = { ...copy[idx], status: 'checked_in', checkedInAt }
          return copy
        }
        return [{ id: uid('a'), registrationId: reg.id, status: 'checked_in', checkedInAt }, ...prev]
      })
      return { status: 'success', eventId: parsed.eventId, checkedInAt }
    },
    [attendance, registrations],
  )

  const adminUpdateUserRole = useCallback((userId: string, role: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))
  }, [])

  const adminToggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u)),
    )
  }, [])

  const adminDeleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    setRegistrations((prev) => prev.filter((r) => r.studentId !== userId))
    if (session?.userId === userId) setSession(null)
  }, [session?.userId])

  const value: AuthContextValue = useMemo(
    () => ({
      currentUser,
      users,
      events,
      registrations,
      attendance,
      login,
      registerAccount,
      logout,
      createEvent,
      updateEvent,
      registerForEvent,
      buildReport,
      exportReportPlaceholder,
      makeQrPayload,
      checkInWithQr,
      adminUpdateUserRole,
      adminToggleUserStatus,
      adminDeleteUser,
    }),
    [
      attendance,
      buildReport,
      checkInWithQr,
      createEvent,
      currentUser,
      events,
      exportReportPlaceholder,
      login,
      logout,
      makeQrPayload,
      registerAccount,
      registerForEvent,
      registrations,
      updateEvent,
      users,
      adminDeleteUser,
      adminToggleUserStatus,
      adminUpdateUserRole,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

