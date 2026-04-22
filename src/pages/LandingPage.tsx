import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const features = [
  { title: 'Browse events', desc: 'Find workshops, seminars, fairs, and campus activities in one place.' },
  { title: 'Register easily', desc: 'One-click registration with clear capacity and status indicators.' },
  { title: 'QR attendance check‑in', desc: 'Confirm attendance using a secure, time‑limited QR payload (mocked).' },
  { title: 'Organizer reports', desc: 'Track registrations and attendance with clean tables and summaries.' },
  { title: 'Admin user management', desc: 'Manage roles, status, and user actions in a structured dashboard.' },
]

export default function LandingPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 subtle-grid opacity-60" aria-hidden="true" />
      <section className="relative">
        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                Frontend prototype • SmartAttend
              </div>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Intelligent attendance management for university events.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base text-slate-600 sm:text-lg">
                SmartAttend helps An‑Najah students discover events, register in seconds, and confirm attendance using QR
                check‑in—while giving organizers and admins clear reporting and control.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/auth">
                  <Button>Login</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="secondary">Create account</Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="card p-4">
                  <div className="text-sm font-semibold text-slate-900">Academic, clean UI</div>
                  <div className="mt-1 text-sm text-slate-600">Accessible typography, calm colors, and responsive layout.</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm font-semibold text-slate-900">Mocked backend‑ready structure</div>
                  <div className="mt-1 text-sm text-slate-600">State and models are organized for future integration.</div>
                </div>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-accent-600 px-7 py-8 text-white">
                <div className="text-sm font-semibold opacity-90">SmartAttend</div>
                <div className="mt-1 text-2xl font-semibold">University Event Platform</div>
                <div className="mt-2 text-sm opacity-90">
                  Designed for students, organizers, and administrators.
                </div>
              </div>
              <div className="p-7">
                <div className="text-sm font-semibold text-slate-900">What you can do</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-semibold text-slate-900">{f.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
                  Tip: Use the demo accounts on the Login screen to explore each role.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

