// Small fetch wrapper for talking to the Hash Browns applications API
// (see /server — Express + MongoDB). Configure the base URL via the
// VITE_API_URL environment variable (see .env.example).

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/**
 * Submits a completed application to the backend.
 * @param {object} payload - shape: { applicationType, fullName, email,
 *   location, schoolOrOrganization, ageRange, links, details }
 */
export async function submitApplication(payload) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (networkError) {
    throw new ApiError(
      'Could not reach the Hash Browns server. Check your connection and try again.',
      0,
      networkError
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Non-JSON response body; fall through with data = null.
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Something went wrong submitting your application.',
      response.status,
      data?.errors
    )
  }

  return data
}

// ── Admin API ──────────────────────────────────────────────────────
// All admin requests send credentials (cookies) and a custom header that
// doubles as a lightweight CSRF guard (see server/src/middleware/requireAdmin.js).

async function adminFetch(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'hashbrowns-admin',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (networkError) {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0, networkError)
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // no body
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed.', response.status, data?.errors)
  }

  return data
}

export function loginAdmin(username, password) {
  return adminFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function logoutAdmin() {
  return adminFetch('/api/auth/logout', { method: 'POST' })
}

export function fetchCurrentAdmin() {
  return adminFetch('/api/auth/me')
}

export function fetchApplications(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
  ).toString()
  return adminFetch(`/api/applications${query ? `?${query}` : ''}`)
}

export function fetchApplication(id) {
  return adminFetch(`/api/applications/${id}`)
}

export function updateApplicationStatus(id, status) {
  return adminFetch(`/api/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
