import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FIT_FINDER_OPTIONS, PATH_LOOKUP } from '../../data/applyData.js'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const VIEWPORT = { once: true, amount: 0.2 }

export default function FitFinder({ onPick }) {
  const [chosenId, setChosenId] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP

  const chosen = FIT_FINDER_OPTIONS.find((o) => o.id === chosenId)

  return (
    <section className="apply-section apply-section--alt" id="not-sure">
      <div className="container fit-finder">
        <motion.p className="apply-eyebrow" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Not sure where you fit?
        </motion.p>
        <motion.h2 className="section-title" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Tell us what you want to do.
        </motion.h2>
        <motion.p className="apply-section-sub" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          We&rsquo;ll point you at the right application. You can change your mind after.
        </motion.p>

        <motion.div
          className="fit-finder-options"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {FIT_FINDER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`fit-finder-pill${chosenId === option.id ? ' fit-finder-pill--active' : ''}`}
              onClick={() => setChosenId(option.id)}
              aria-pressed={chosenId === option.id}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {chosen && (
            <motion.div
              key={chosen.id}
              className="fit-finder-result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="fit-finder-result-label">Recommended for you</span>
              <div className="fit-finder-result-paths">
                {chosen.recommends.map((pathId) => {
                  const path = PATH_LOOKUP[pathId]
                  if (!path) return null
                  return (
                    <button
                      key={pathId}
                      type="button"
                      className="fit-finder-result-path"
                      onClick={() => onPick(pathId)}
                    >
                      <span>{path.title}</span>
                      <span className="fit-finder-result-arrow" aria-hidden="true">→</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
