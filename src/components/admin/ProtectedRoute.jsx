import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { status } = useAdminAuth()
  const location = useLocation()

  if (status === 'checking') {
    return (
      <div className="admin-loading-screen" aria-live="polite">
        <div className="admin-spinner" aria-hidden="true" />
        <span>Checking session&hellip;</span>
      </div>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return children
}
