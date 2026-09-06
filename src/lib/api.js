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
