import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login/${role}`} state={{ from: location }} replace />
  }
  if (user.role !== role) {
    return <Navigate to={`/login/${role}`} replace />
  }
  return children
}
