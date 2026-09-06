import jwt from 'jsonwebtoken'

const DEFAULT_EXPIRY = '8h'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET is not set (or is too short). Generate one with `openssl rand -hex 32` and put it in server/.env.'
    )
  }
  return secret
}

/**
 * Signs a short-lived admin session token. Payload is intentionally minimal —
 * just enough to identify the session, never the password or its hash.
 */
export function signAdminToken(username) {
  return jwt.sign(
    { sub: username, role: 'admin' },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRY }
  )
}

/**
 * Verifies a token and returns its decoded payload, or throws.
 */
export function verifyAdminToken(token) {
  return jwt.verify(token, getSecret())
}

export const AUTH_COOKIE_NAME = 'hb_admin_session'

export function authCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true, // not readable from JS — mitigates token theft via XSS
    secure: isProd, // HTTPS-only in production
    sameSite: 'strict', // never sent on cross-site requests — mitigates CSRF
    path: '/',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours, matches DEFAULT_EXPIRY
  }
}
