import { motion, AnimatePresence } from 'framer-motion'

const STATUS_OPTIONS = ['submitted', 'in_review', 'accepted', 'declined']

function formatKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
}

function formatValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '\u2014'
  if (value === null || value === undefined || value === '') return '\u2014'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export default function ApplicationDetailModal({ application, onClose, onStatusChange, statusUpdating }) {
  return (
    <AnimatePresence>
      {application && (
        <motion.div
          className="admin-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="admin-modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >
            <button className="admin-modal-close" onClick={onClose} aria-label="Close">&times;</button>

            <div className="admin-modal-header">
              <span className={`admin-badge admin-badge--${application.applicationType}`}>
                {application.applicationType}
              </span>
              <h2 id="admin-modal-title">{application.fullName}</h2>
              <p className="admin-modal-email">{application.email}</p>
            </div>

            <div className="admin-modal-status-row">
              <span className="admin-modal-label">Status</span>
              <select
                className="admin-status-select"
                value={application.status}
                disabled={statusUpdating}
                onChange={(e) => onStatusChange(application._id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{formatKey(s)}</option>
                ))}
              </select>
            </div>

            <dl className="admin-modal-grid">
              <div><dt>Location</dt><dd>{formatValue(application.location)}</dd></div>
              <div><dt>School / Organization</dt><dd>{formatValue(application.schoolOrOrganization)}</dd></div>
              <div><dt>Age range</dt><dd>{formatValue(application.ageRange)}</dd></div>
              <div><dt>Links</dt><dd>{formatValue(application.links)}</dd></div>
              <div><dt>Submitted</dt><dd>{new Date(application.createdAt).toLocaleString()}</dd></div>
            </dl>

            {application.details && Object.keys(application.details).length > 0 && (
              <>
                <h3 className="admin-modal-subhead">Application details</h3>
                <dl className="admin-modal-grid">
                  {Object.entries(application.details).map(([key, value]) => (
                    <div key={key}>
                      <dt>{formatKey(key)}</dt>
                      <dd>{formatValue(value)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
