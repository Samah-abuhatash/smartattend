export type UserRole = 'student' | 'organizer' | 'admin'

export type UserStatus = 'active' | 'disabled'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  password: string
  status: UserStatus
}

export type Event = {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  location: string
  organizerId: string
  description: string
  capacity: number
  bannerVariant?: 'seminar' | 'workshop' | 'sports' | 'career' | 'community'
  registrationClosed?: boolean
}

export type Registration = {
  id: string
  eventId: string
  studentId: string
  createdAt: string
}

export type Attendance = {
  id: string
  registrationId: string
  status: 'not_checked_in' | 'checked_in'
  checkedInAt?: string
}

export type Report = {
  eventId: string
  registrations: number
  attendance: number
  capacity: number
}

