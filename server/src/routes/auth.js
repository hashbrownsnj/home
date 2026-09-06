import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { AUTH_COOKIE_NAME, authCookieOptions, signAdminToken } from '../utils/authTokens.js'
import { isLockedOut, recordFailedAttempt, clearAttempts } from '../utils/loginAttempts.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()

// Coarse IP-based throttle in front of the finer per-account lockout below.
// Keeps a single attacker from hammering the endpoint even across usernames.
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
})

router.post('/login', loginRateLimiter, async (req, res) => {
  const { username, password } = req.body || {}
  const ip = req.ip

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  const lockout = isLockedOut(ip, username)
  if (lockout.locked) {
    const seconds = Math.ceil(lockout.retryAfterMs / 1000)
    return res.status(429).json({ message: `Too many failed attempts. Try again in ${seconds}s.` })
  }

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedHash = process.env.ADMIN_PASSWORD_HASH

  if (!expectedUsername || !expectedHash) {
    console.error('[auth] ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not configured.')
    return res.status(500).json({ message: 'Admin login is not configured on the server.' })
  }

  // Compare the username with a fixed-time-ish check and always run bcrypt
  // (even on a username mismatch) so responses take a similar amount of
  // time whether the username or password was wrong — avoids leaking which
  // one failed via timing.
  const usernameMatches = username === expectedUsername
  const passwordMatches = await bcrypt.compare(password, expectedHash)

  if (!usernameMatches || !passwordMatches) {
    recordFailedAttempt(ip, username)
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  clearAttempts(ip, username)
  const token = signAdminToken(expectedUsername)
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions())
  return res.json({ message: 'Logged in.', username: expectedUsername })
})

router.post('/logout', (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions(), maxAge: 0 })
  return res.json({ message: 'Logged out.' })
})

// Lets the frontend check "am I still logged in?" on load / route change.
router.get('/me', requireAdmin, (req, res) => {
  return res.json({ username: req.admin.username })
})

export default router
