import type { Attendance, Event, Registration, User } from '../types/models'

export const seedUsers: User[] = [
  {
    id: 'u-stu-1001',
    name: 'Lina Qasem',
    email: 'lina.qasem@najah.edu',
    role: 'student',
    password: 'Password123!',
    status: 'active',
  },
  {
    id: 'u-org-2001',
    name: 'Dr. Ahmad Saleh',
    email: 'ahmad.saleh@najah.edu',
    role: 'organizer',
    password: 'Password123!',
    status: 'active',
  },
  {
    id: 'u-admin-3001',
    name: 'System Admin',
    email: 'admin@najah.edu',
    role: 'admin',
    password: 'Password123!',
    status: 'active',
  },
  {
    id: 'u-stu-1002',
    name: 'Omar Nassar',
    email: 'omar.nassar@najah.edu',
    role: 'student',
    password: 'Password123!',
    status: 'active',
  },
]

export const seedEvents: Event[] = [
  {
    id: 'e-501',
    title: 'AI in Higher Education: Practical Workshop',
    date: '2026-05-02',
    time: '11:00',
    location: 'Engineering Building — Hall B',
    organizerId: 'u-org-2001',
    description:
      'Hands-on session on responsible AI tools for studying and research, including prompt crafting, citations, and evaluation.',
    capacity: 80,
    bannerVariant: 'workshop',
  },
  {
    id: 'e-502',
    title: 'Career Fair: Tech & Innovation Day',
    date: '2026-05-10',
    time: '10:00',
    location: 'Main Campus — Central Courtyard',
    organizerId: 'u-org-2001',
    description:
      'Meet employers, explore internships, and attend short talks on CV building and interview readiness.',
    capacity: 600,
    bannerVariant: 'career',
  },
  {
    id: 'e-503',
    title: 'Campus Community Volunteering Meetup',
    date: '2026-05-18',
    time: '14:30',
    location: 'Student Affairs — Room 104',
    organizerId: 'u-org-2001',
    description:
      'Join volunteering initiatives and learn how to participate in community impact programs across the city.',
    capacity: 120,
    bannerVariant: 'community',
  },
  {
    id: 'e-504',
    title: 'Interfaculty Sports Day (Registrations Closed)',
    date: '2026-04-28',
    time: '09:00',
    location: 'University Stadium',
    organizerId: 'u-org-2001',
    description:
      'Friendly competitions across faculties. Registration is closed; spectators are welcome.',
    capacity: 400,
    bannerVariant: 'sports',
    registrationClosed: true,
  },
  {
    id: 'e-505',
    title: 'Research Seminar: Writing & Publishing',
    date: '2026-06-03',
    time: '12:15',
    location: 'Library — Seminar Room 2',
    organizerId: 'u-org-2001',
    description:
      'A seminar focused on research structure, peer review, and choosing appropriate journals.',
    capacity: 60,
    bannerVariant: 'seminar',
  },
]

export const seedRegistrations: Registration[] = [
  {
    id: 'r-9001',
    eventId: 'e-501',
    studentId: 'u-stu-1001',
    createdAt: '2026-04-21T09:20:00Z',
  },
  {
    id: 'r-9002',
    eventId: 'e-504',
    studentId: 'u-stu-1002',
    createdAt: '2026-04-19T13:10:00Z',
  },
]

export const seedAttendance: Attendance[] = [
  {
    id: 'a-9901',
    registrationId: 'r-9002',
    status: 'checked_in',
    checkedInAt: '2026-04-20T08:30:00Z',
  },
]

export const universityEmailRegex = /^[a-zA-Z0-9._%+-]+@najah\.edu$/i

