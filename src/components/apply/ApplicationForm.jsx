import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import PathCards from './PathCards.jsx'
import FormField from './FormField.jsx'
import MultiStepProgress from './MultiStepProgress.jsx'
import {
  PATH_LOOKUP,
  BASIC_INFO_FIELDS,
  AGE_FIELD,
  PATHS_REQUIRING_AGE,
  EXPERIENCE_FIELD_SETS,
} from '../../data/applyData.js'
import { submitApplication, ApiError } from '../../lib/api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function fieldsForStep(step, path) {
  if (!path) return []
  if (step === 2) {
    return PATHS_REQUIRING_AGE.includes(path.id) ? [...BASIC_INFO_FIELDS, AGE_FIELD] : BASIC_INFO_FIELDS
  }
  if (step === 3) return path.roleFields
  if (step === 4) return EXPERIENCE_FIELD_SETS[path.experienceFields] || []
  return []
}

function validateStep(step, path, formData) {
  const errors = {}
  for (const field of fieldsForStep(step, path)) {
    if (!field.required) continue
    const value = formData[field.name]
    const isEmpty =
      value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
    if (isEmpty) {
      errors[field.name] = 'This field is required.'
    } else if (field.type === 'email' && !EMAIL_RE.test(value)) {
      errors[field.name] = 'Enter a valid email address.'
    }
  }
  return errors
}

function buildPayload(path, formData) {
  const basicNames = new Set([...BASIC_INFO_FIELDS.map((f) => f.name), AGE_FIELD.name])
  const details = {}
  let links = ''

  for (const field of [...path.roleFields, ...(EXPERIENCE_FIELD_SETS[path.experienceFields] || [])]) {
    if (basicNames.has(field.name)) continue
    if (field.name === 'links') {
      links = formData.links || ''
      continue
    }
    if (formData[field.name] !== undefined) {
      details[field.name] = formData[field.name]
    }
  }

  return {
    applicationType: path.id,
    fullName: formData.fullName || '',
    email: formData.email || '',
    location: formData.location || '',
    schoolOrOrganization: formData.schoolOrOrganization || '',
    ageRange: formData.ageRange || '',
    links,
    details,
  }
}

export default function ApplicationForm({ selectedPath, onSelectPath, formStep, onStepChange }) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const path = selectedPath ? PATH_LOOKUP[selectedPath] : null

  // When a path is chosen from outside the form (hero cards, fit finder),
  // jump straight to Step 2 — the path is already decided.
  useEffect(() => {
    if (selectedPath && formStep === 1) {
      onStepChange(2)
    }
  }, [selectedPath]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentStepFields = useMemo(() => fieldsForStep(formStep, path), [formStep, path])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const goNext = () => {
    if (formStep === 1) {
      if (!selectedPath) {
        setErrors({ _path: 'Pick a path to continue.' })
        return
      }
      setErrors({})
      onStepChange(2)
      return
    }
    const stepErrors = validateStep(formStep, path, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    onStepChange(Math.min(formStep + 1, 5))
  }

  const goBack = () => {
    setErrors({})
    onStepChange(Math.max(formStep - 1, 1))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitApplication(buildPayload(path, formData))
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError('Something went wrong submitting your application. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
    setSubmitError(null)
    onSelectPath(null)
    onStepChange(1)
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <span className="form-success-badge">You&rsquo;re in the system 🥔</span>
        <h3 className="form-success-title">Application received.</h3>
        <p className="form-success-body">
          Thanks for applying to Hash Browns as {path?.title.toLowerCase()}. A real person on our
          team will review this and follow up by email &mdash; leadership applications usually
          hear back within a couple of weeks, and member or volunteer applications are typically
          faster.
        </p>
        <button type="button" className="btn btn-ghost" onClick={resetForm}>
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <div className="application-form">
      <MultiStepProgress currentStep={formStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={formStep}
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, x: -16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="form-step"
        >
          {formStep === 1 && (
            <>
              <h3 className="form-step-title">First, choose your path.</h3>
              <PathCards selectedPath={selectedPath} onSelect={onSelectPath} size="compact" />
              {errors._path && <p className="form-error" role="alert">{errors._path}</p>}
            </>
          )}

          {formStep >= 2 && formStep <= 4 && path && (
            <>
              <h3 className="form-step-title">
                {formStep === 2 && 'A little about you.'}
                {formStep === 3 && `${path.title}: the details.`}
                {formStep === 4 && 'Experience & interests.'}
              </h3>
              {currentStepFields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                />
              ))}
            </>
          )}

          {formStep === 5 && path && (
            <>
              <h3 className="form-step-title">Review your application.</h3>
              <div className="form-review">
                <div className="form-review-row">
                  <span className="form-review-key">Applying for</span>
                  <span className="form-review-value">{path.title}</span>
                </div>
                {[...BASIC_INFO_FIELDS, ...(PATHS_REQUIRING_AGE.includes(path.id) ? [AGE_FIELD] : [])]
                  .filter((f) => formData[f.name])
                  .map((f) => (
                    <div className="form-review-row" key={f.name}>
                      <span className="form-review-key">{f.label}</span>
                      <span className="form-review-value">{formData[f.name]}</span>
                    </div>
                  ))}
              </div>
              <p className="form-consent-note">
                By submitting, you confirm the information above is accurate and understand the
                Hash Browns team will review it to follow up about next steps. If you&rsquo;re
                under 18, it&rsquo;s a good idea to let a parent or guardian know you&rsquo;re
                applying.
              </p>
              {submitError && <p className="form-error" role="alert">{submitError}</p>}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="form-nav">
        {formStep > 1 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={goBack} disabled={submitting}>
            Back
          </button>
        )}
        <div className="form-nav-spacer" />
        {formStep < 5 && (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Continue
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        )}
        {formStep === 5 && (
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
        )}
      </div>
    </div>
  )
}
