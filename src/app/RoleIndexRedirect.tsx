import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function RoleIndexRedirect() {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/auth" replace />

  if (currentUser.role === 'organizer') return <Navigate to="/app/organizer/dashboard" replace />
  if (currentUser.role === 'admin') return <Navigate to="/app/admin/users" replace />
  return <Navigate to="/app/student/events" replace />
}

