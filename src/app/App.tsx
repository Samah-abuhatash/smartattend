import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../state/AuthContext'
import { ToastProvider } from '../state/ToastContext'
import LandingPage from '../pages/LandingPage'
import AuthPage from '../pages/AuthPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import StudentEventsPage from '../pages/student/StudentEventsPage'
import EventDetailsPage from '../pages/student/EventDetailsPage'
import QrCheckInPage from '../pages/student/QrCheckInPage'
import OrganizerDashboardPage from '../pages/organizer/OrganizerDashboardPage'
import CreateEventPage from '../pages/organizer/CreateEventPage'
import EditEventPage from '../pages/organizer/EditEventPage'
import AttendanceReportPage from '../pages/organizer/AttendanceReportPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import RequireAuth from './guards/RequireAuth'
import RoleIndexRedirect from './RoleIndexRedirect'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          <Route
            path="/app"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<RoleIndexRedirect />} />

            <Route path="student/events" element={<RequireAuth role="student"><StudentEventsPage /></RequireAuth>} />
            <Route path="student/events/:eventId" element={<RequireAuth role="student"><EventDetailsPage /></RequireAuth>} />
            <Route path="student/check-in" element={<RequireAuth role="student"><QrCheckInPage /></RequireAuth>} />

            <Route path="organizer/dashboard" element={<RequireAuth role="organizer"><OrganizerDashboardPage /></RequireAuth>} />
            <Route path="organizer/events/new" element={<RequireAuth role="organizer"><CreateEventPage /></RequireAuth>} />
            <Route path="organizer/events/:eventId/edit" element={<RequireAuth role="organizer"><EditEventPage /></RequireAuth>} />
            <Route path="organizer/reports" element={<RequireAuth role="organizer"><AttendanceReportPage /></RequireAuth>} />

            <Route path="admin/users" element={<RequireAuth role="admin"><AdminUsersPage /></RequireAuth>} />
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

