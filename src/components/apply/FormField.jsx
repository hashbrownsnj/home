// Generic, config-driven field renderer. Every application type reuses
// this instead of hand-rolling markup per field — see src/data/applyData.js
// for the field configs themselves.

export default function FormField({ field, value, onChange, error }) {
  const { name, label, type, required, options = [], placeholder, helper } = field
  const inputId = `field-${name}`
  const describedBy = [
    helper ? `${inputId}-helper` : null,
    error ? `${inputId}-error` : null,
  ].filter(Boolean).join(' ') || undefined

  const commonLabel = (
    <label htmlFor={inputId} className="form-label">
      {label}
      {required && <span className="form-required" aria-hidden="true">*</span>}
      {!required && <span className="form-optional">(optional)</span>}
    </label>
  )

  let control = null

  if (type === 'text' || type === 'email' || type === 'number') {
    control = (
      <input
        id={inputId}
        name={name}
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={`form-input${error ? ' form-input--error' : ''}`}
      />
    )
  } else if (type === 'textarea') {
    control = (
      <textarea
        id={inputId}
        name={name}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        rows={4}
        className={`form-input form-textarea${error ? ' form-input--error' : ''}`}
      />
    )
  } else if (type === 'select') {
    control = (
      <select
        id={inputId}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={`form-input form-select${error ? ' form-input--error' : ''}`}
      >
        <option value="" disabled>Select one&hellip;</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )
  } else if (type === 'radio') {
    control = (
      <div className="form-radio-group" role="radiogroup" aria-describedby={describedBy}>
        {options.map((opt) => (
          <label key={opt.value} className="form-radio-option">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(name, e.target.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    )
  } else if (type === 'checkboxGroup') {
    const selected = Array.isArray(value) ? value : []
    control = (
      <div className="form-checkbox-group" aria-describedby={describedBy}>
        {options.map((opt) => {
          const checked = selected.includes(opt.value)
          return (
            <label key={opt.value} className="form-checkbox-option">
              <input
                type="checkbox"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => {
                  const next = checked
                    ? selected.filter((v) => v !== opt.value)
                    : [...selected, opt.value]
                  onChange(name, next)
                }}
              />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div className="form-field">
      {commonLabel}
      {control}
      {helper && <p id={`${inputId}-helper`} className="form-helper">{helper}</p>}
      {error && <p id={`${inputId}-error`} className="form-error" role="alert">{error}</p>}
    </div>
  )
}
