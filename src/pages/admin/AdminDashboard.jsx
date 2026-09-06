import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { fetchApplications, fetchApplication, updateApplicationStatus, ApiError } from '../../lib/api.js'
import ApplicationDetailModal from '../../components/admin/ApplicationDetailModal.jsx'

const TYPES = ['department', 'chapter', 'member', 'team', 'volunteer']
const STATUSES = ['submitted', 'in_review', 'accepted', 'declined']
const PAGE_SIZE = 20

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function AdminDashboard() {
  const { username, logout } = useAdminAuth()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusCounts, setStatusCounts] = useState(null)

  const [selectedId, setSelectedId] = useState(null)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const handleSessionExpired = useCallback(async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }, [logout, navigate])

  const loadApplications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchApplications({
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit: PAGE_SIZE,
      })
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleSessionExpired()
        return
      }
      setError(err?.message || 'Could not load applications.')
    } finally {
      setLoading(false)
    }
  }, [typeFilter, statusFilter, page, handleSessionExpired])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  // Lightweight stat counts per status — one small request per status
  // (limit=1 keeps the payload tiny; only the `total` field is used).
  useEffect(() => {
    let cancelled = false
    async function loadCounts() {
      try {
        const results = await Promise.all(
          STATUSES.map((s) => fetchApplications({ status: s, limit: 1 }))
        )
        if (cancelled) return
        const counts = {}
        STATUSES.forEach((s, i) => { counts[s] = results[i].total })
        setStatusCounts(counts)
      } catch {
        // Non-critical — stats just won't render.
      }
    }
    loadCounts()
    return () => { cancelled = true }
  }, [])

  useEffect(() => { setPage(1) }, [typeFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const totalApplications = useMemo(
    () => (statusCounts ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : null),
    [statusCounts]
  )

  async function openApplication(id) {
    setSelectedId(id)
    try {
      const data = await fetchApplication(id)
      setSelectedApplication(data)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleSessionExpired()
        return
      }
      setError(err?.message || 'Could not load that application.')
      setSelectedId(null)
    }
  }

  function closeModal() {
    setSelectedId(null)
    setSelectedApplication(null)
  }

  async function handleStatusChange(id, status) {
    setStatusUpdating(true)
    try {
      const updated = await updateApplicationStatus(id, status)
      setSelectedApplication(updated)
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, status } : it)))
      setStatusCounts(null) // stale — refetched below
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleSessionExpired()
        return
      }
      setError(err?.message || 'Could not update status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  // Refetch counts whenever they're invalidated by a status change.
  useEffect(() => {
    if (statusCounts !== null) return
    let cancelled = false
    ;(async () => {
      try {
        const results = await Promise.all(STATUSES.map((s) => fetchApplications({ status: s, limit: 1 })))
        if (cancelled) return
        const counts = {}
        STATUSES.forEach((s, i) => { counts[s] = results[i].total })
        setStatusCounts(counts)
      } catch {
        /* non-critical */
      }
    })()
    return () => { cancelled = true }
  }, [statusCounts])

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-glow" aria-hidden="true" />

      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">HASHBROWNS ADMIN</p>
          <h1>Applications</h1>
        </div>
        <div className="admin-header-actions">
          <span className="admin-user-chip">
            <span className="admin-user-dot" aria-hidden="true" />
            {username}
          </span>
          <button className="admin-btn admin-btn--ghost" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="admin-stats" aria-label="Application stats">
        <motion.div className="admin-stat-card admin-stat-card--total" whileHover={{ y: -3 }}>
          <span className="admin-stat-value">{totalApplications ?? '\u2013'}</span>
          <span className="admin-stat-label">Total received</span>
        </motion.div>
        {STATUSES.map((s) => (
          <motion.div key={s} className={`admin-stat-card admin-stat-card--${s}`} whileHover={{ y: -3 }}>
            <span className="admin-stat-value">{statusCounts ? statusCounts[s] : '\u2013'}</span>
            <span className="admin-stat-label">{s.replace('_', ' ')}</span>
          </motion.div>
        ))}
      </section>

      <section className="admin-filters">
        <div className="admin-filter-group">
          <label htmlFor="filter-type">Type</label>
          <select id="filter-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="admin-filter-group">
          <label htmlFor="filter-status">Status</label>
          <select id="filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <button className="admin-btn admin-btn--ghost admin-btn--small" onClick={loadApplications}>
          Refresh
        </button>
      </section>

      {error && <p className="admin-error-banner" role="alert">{error}</p>}

      <section className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading-row">Loading applications&hellip;</div>
        ) : items.length === 0 ? (
          <div className="admin-empty-row">No applications match these filters.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((app, i) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => openApplication(app._id)}
                    className={selectedId === app._id ? 'is-selected' : ''}
                  >
                    <td>
                      <div className="admin-table-name">{app.fullName}</div>
                      <div className="admin-table-email">{app.email}</div>
                    </td>
                    <td><span className={`admin-badge admin-badge--${app.applicationType}`}>{app.applicationType}</span></td>
                    <td>{app.location}</td>
                    <td><span className={`admin-status-pill admin-status-pill--${app.status}`}>{app.status.replace('_', ' ')}</span></td>
                    <td>{timeAgo(app.createdAt)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </section>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn admin-btn--ghost admin-btn--small"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="admin-btn admin-btn--ghost admin-btn--small"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      <ApplicationDetailModal
        application={selectedApplication}
        onClose={closeModal}
        onStatusChange={handleStatusChange}
        statusUpdating={statusUpdating}
      />
    </div>
  )
}
