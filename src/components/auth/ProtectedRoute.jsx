import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--col-bg)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid var(--col-border)',
          borderTopColor: 'var(--col-accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export function GuestRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}
