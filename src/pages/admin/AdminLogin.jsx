import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

export default function AdminLogin() {
  const { status, login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from || '/admin'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
      setPassword('')
    }
  }

  return (
    <div className="admin-auth-screen">
      <div className="admin-auth-glow" aria-hidden="true" />
      <motion.div
        className="admin-auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="admin-auth-badge">
          <span className="admin-auth-badge-dot" aria-hidden="true" />
          Restricted access
        </div>

        <h1 className="admin-auth-title">HASH<span>BROWNS</span> Admin</h1>
        <p className="admin-auth-subtitle">Sign in to review applications.</p>

        <form onSubmit={handleSubmit} className="admin-auth-form" autoComplete="off">
          <div className="form-field">
            <label htmlFor="admin-username" className="form-label">Username</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={submitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password" className="form-label">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={submitting}
            />
          </div>

          {error && (
            <motion.p
              className="admin-auth-error"
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <button type="submit" className="admin-btn admin-btn--primary admin-btn--full" disabled={submitting}>
            {submitting ? 'Signing in\u2026' : 'Sign in'}
          </button>
        </form>

        <p className="admin-auth-footnote">
          Sessions expire automatically. Failed attempts are rate-limited and logged.
        </p>
      </motion.div>
    </div>
  )
}
