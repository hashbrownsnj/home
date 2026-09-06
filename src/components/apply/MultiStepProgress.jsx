const STEP_LABELS = [
  'Choose your path',
  'Basic information',
  'Role-specific questions',
  'Experience & interests',
  'Review & submit',
]

export default function MultiStepProgress({ currentStep }) {
  return (
    <ol className="form-progress" aria-label="Application progress">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1
        const state = stepNum === currentStep ? 'current' : stepNum < currentStep ? 'done' : 'upcoming'
        return (
          <li key={label} className={`form-progress-step form-progress-step--${state}`}>
            <span className="form-progress-index" aria-hidden="true">
              {state === 'done' ? '✓' : stepNum}
            </span>
            <span className="form-progress-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
