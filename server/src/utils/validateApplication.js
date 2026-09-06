import { APPLICATION_TYPES } from '../models/Application.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mirrors src/data/applyData.js on the frontend at the level that matters
// server-side: which fields are required, and roughly what shape `details`
// should have per path. Kept intentionally lighter than the client-side
// validation — the client is the UX; this is the safety net.
const REQUIRED_DETAIL_FIELDS = {
  department: ['department', 'departmentFit', 'positionFit'],
  chapter: [
    'hostLocation',
    'locationType',
    'recruitmentPlan',
    'whyStartChapter',
    'impactGoal',
    'expectedMembers',
    'meetingFrequency',
    'chapterGoals',
  ],
  member: ['experienceLevel', 'participationInterests', 'lookingForTeam', 'lookingForChapter'],
  team: ['teamStatus', 'experienceLevel', 'competitionInterests'],
  volunteer: ['volunteerInterests', 'availability'],
}

/**
 * Validates a raw application submission body.
 * Returns { valid: boolean, errors: { field: message } }
 */
export function validateApplication(body) {
  const errors = {}

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { _root: 'Request body must be an object.' } }
  }

  const { applicationType, fullName, email, location, details } = body

  if (!APPLICATION_TYPES.includes(applicationType)) {
    errors.applicationType = `applicationType must be one of: ${APPLICATION_TYPES.join(', ')}`
  }

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    errors.email = 'A valid email address is required.'
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    errors.location = 'Location is required.'
  }

  if (applicationType && REQUIRED_DETAIL_FIELDS[applicationType]) {
    const missing = REQUIRED_DETAIL_FIELDS[applicationType].filter((key) => {
      const value = details?.[key]
      return value === undefined || value === null || value === '' ||
        (Array.isArray(value) && value.length === 0)
    })
    if (missing.length > 0) {
      errors.details = `Missing required field(s) for ${applicationType}: ${missing.join(', ')}`
    }
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
