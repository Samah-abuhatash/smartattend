import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import type { UserRole } from '../../types/models'

export default function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { currentUser } = useAuth()

  if (!currentUser) return <Navigate to="/auth" replace />
  if (role && currentUser.role !== role) return <Navigate to="/app" replace />
  return <>{children}</>
}

