import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import Application from '../models/Application.js'
import { validateApplication } from '../utils/validateApplication.js'
import { requireAdmin, requireFetchHeader } from '../middleware/requireAdmin.js'

const router = Router()

// Throttle public submissions to make it harder to spam the form.
const submitRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this address. Please try again later.' },
})

// POST /api/applications — create a new application (used by the /apply page).
router.post('/', submitRateLimiter, async (req, res) => {
  const { valid, errors } = validateApplication(req.body)
  if (!valid) {
    return res.status(400).json({ message: 'Your application has some missing or invalid fields.', errors })
  }

  try {
    const {
      applicationType,
      fullName,
      email,
      location,
      schoolOrOrganization,
      ageRange,
      links,
      details,
    } = req.body

    const application = await Application.create({
      applicationType,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      location: location.trim(),
      schoolOrOrganization: (schoolOrOrganization || '').trim(),
      ageRange: ageRange || '',
      links: (links || '').trim(),
      details: details || {},
      meta: {
        userAgent: req.get('user-agent') || '',
        ip: req.ip || '',
      },
    })

    return res.status(201).json({
      message: 'Application received.',
      id: application._id,
    })
  } catch (err) {
    console.error('[applications] create failed:', err)
    return res.status(500).json({ message: 'Something went wrong saving your application. Please try again.' })
  }
})

// GET /api/applications — list applications for internal review.
// Protected: requires a valid admin session cookie (see routes/auth.js).
router.get('/', requireAdmin, async (req, res) => {
  const { type, status, limit = 50, page = 1 } = req.query
  const filter = {}
  if (type) filter.applicationType = type
  if (status) filter.status = status

  const pageSize = Math.min(Number(limit) || 50, 200)
  const pageNum = Math.max(Number(page) || 1, 1)

  try {
    const [items, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Application.countDocuments(filter),
    ])
    return res.json({ items, total, page: pageNum, pageSize })
  } catch (err) {
    console.error('[applications] list failed:', err)
    return res.status(500).json({ message: 'Could not load applications.' })
  }
})

// GET /api/applications/:id — fetch a single application.
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).lean()
    if (!application) return res.status(404).json({ message: 'Application not found.' })
    return res.json(application)
  } catch (err) {
    return res.status(400).json({ message: 'Invalid application id.' })
  }
})

// PATCH /api/applications/:id/status — update review status.
router.patch('/:id/status', requireAdmin, requireFetchHeader, async (req, res) => {
  const { status } = req.body
  const allowed = ['submitted', 'in_review', 'accepted', 'declined']
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` })
  }

  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!application) return res.status(404).json({ message: 'Application not found.' })
    return res.json(application)
  } catch (err) {
    return res.status(400).json({ message: 'Invalid application id.' })
  }
})

export default router
