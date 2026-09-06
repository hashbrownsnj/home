import { AUTH_COOKIE_NAME, verifyAdminToken } from '../utils/authTokens.js'

/**
 * Protects a route behind a valid admin session cookie. On success,
 * attaches req.admin = { username }. On failure, always responds with a
 * generic 401 — never leaks whether the cookie was missing, expired, or
 * tampered with.
 */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME]
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }

  try {
    const payload = verifyAdminToken(token)
    if (payload.role !== 'admin') {
      return res.status(401).json({ message: 'Not authenticated.' })
    }
    req.admin = { username: payload.sub }
    return next()
  } catch {
    return res.status(401).json({ message: 'Not authenticated.' })
  }
}

/**
 * Lightweight CSRF guard for cookie-authenticated state-changing requests.
 * Real cross-site requests can't set custom headers without the browser
 * first sending a CORS preflight, which our origin allow-list will reject —
 * so requiring this header blocks simple cross-site form/fetch forgeries.
 * Belt-and-suspenders alongside the SameSite=strict session cookie.
 */
export function requireFetchHeader(req, res, next) {
  if (req.get('X-Requested-With') !== 'hashbrowns-admin') {
    return res.status(403).json({ message: 'Missing required request header.' })
  }
  return next()
}
