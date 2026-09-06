// Tracks failed login attempts per (IP + username) pair and applies an
// escalating lockout on top of the express-rate-limit layer. This is
// in-memory, which is fine for a single admin-tool instance; if this ever
// runs as multiple processes/containers, swap this for a shared store
// (e.g. Redis) so lockouts are consistent across instances.

const attempts = new Map() // key -> { count, lockedUntil }

const MAX_ATTEMPTS = 5
const BASE_LOCKOUT_MS = 60 * 1000 // 1 minute, doubles per additional failure
const WINDOW_MS = 15 * 60 * 1000 // failures older than this are forgotten

function key(ip, username) {
  return `${ip}::${String(username || '').toLowerCase()}`
}

export function isLockedOut(ip, username) {
  const entry = attempts.get(key(ip, username))
  if (!entry) return { locked: false }
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
    return { locked: true, retryAfterMs: entry.lockedUntil - Date.now() }
  }
  return { locked: false }
}

export function recordFailedAttempt(ip, username) {
  const k = key(ip, username)
  const now = Date.now()
  const entry = attempts.get(k)

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(k, { count: 1, firstAttemptAt: now, lockedUntil: 0 })
    return
  }

  entry.count += 1
  if (entry.count >= MAX_ATTEMPTS) {
    const extraFailures = entry.count - MAX_ATTEMPTS
    entry.lockedUntil = now + BASE_LOCKOUT_MS * 2 ** extraFailures
  }
}

export function clearAttempts(ip, username) {
  attempts.delete(key(ip, username))
}

// Periodic cleanup so this map doesn't grow forever.
setInterval(() => {
  const now = Date.now()
  for (const [k, entry] of attempts) {
    if (now - entry.firstAttemptAt > WINDOW_MS && entry.lockedUntil < now) {
      attempts.delete(k)
    }
  }
}, WINDOW_MS).unref()
