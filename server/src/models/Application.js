import mongoose from 'mongoose'

const { Schema } = mongoose

export const APPLICATION_TYPES = ['department', 'chapter', 'member', 'team', 'volunteer']

const ApplicationSchema = new Schema(
  {
    // Which of the 5 apply-page paths this came through.
    applicationType: {
      type: String,
      required: true,
      enum: APPLICATION_TYPES,
      index: true,
    },

    // Shared basic info, collected on Step 2 for every path.
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    schoolOrOrganization: { type: String, trim: true, maxlength: 200, default: '' },
    ageRange: { type: String, trim: true, maxlength: 20, default: '' },

    // Optional links (portfolio, GitHub, LinkedIn, etc.) collected on Step 4.
    links: { type: String, trim: true, maxlength: 1000, default: '' },

    // Everything from Step 3 (role-specific) and Step 4 (experience) that
    // isn't one of the shared fields above. Kept flexible on purpose so new
    // application types or new questions don't require a schema migration.
    details: { type: Schema.Types.Mixed, default: {} },

    // Internal review status — not set by applicants.
    status: {
      type: String,
      enum: ['submitted', 'in_review', 'accepted', 'declined'],
      default: 'submitted',
      index: true,
    },

    meta: {
      userAgent: { type: String, default: '' },
      ip: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

ApplicationSchema.index({ createdAt: -1 })

export default mongoose.model('Application', ApplicationSchema)
