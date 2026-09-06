import { motion, useReducedMotion } from 'framer-motion'
import { GROWTH_STEPS, SCALE_EXAMPLES } from '../../data/applyData.js'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const VIEWPORT = { once: true, amount: 0.15 }

export default function GrowthSection() {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER

  return (
    <section className="apply-section" id="growth">
      <div className="container">
        <motion.p className="apply-eyebrow" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          How Hash Browns grows
        </motion.p>
        <motion.h2 className="section-title" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          One chapter can become a community.
        </motion.h2>
        <motion.p className="apply-section-sub" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          The whole model is decentralized on purpose. One leader starts something small, and the
          structure is built to let it compound.
        </motion.p>

        <motion.div className="growth-flow" variants={sv} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {GROWTH_STEPS.map((step, i) => (
            <motion.div key={step.label} className="growth-flow-item" variants={v}>
              <div className="growth-flow-marker">
                <span className="growth-flow-dot" />
                {i < GROWTH_STEPS.length - 1 && <span className="growth-flow-line" aria-hidden="true" />}
              </div>
              <div className="growth-flow-content">
                <span className="growth-flow-label">{step.label}</span>
                <span className="growth-flow-detail">{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="growth-math" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <span className="growth-math-eyebrow">The math of decentralization</span>
          <div className="growth-math-grid">
            {SCALE_EXAMPLES.map((ex) => (
              <div key={`${ex.chapters}-${ex.perChapter}`} className="growth-math-item">
                <span className="growth-math-formula">
                  {ex.chapters} chapters × {ex.perChapter} members
                </span>
                <span className="growth-math-total">{ex.total}+ people</span>
              </div>
            ))}
          </div>
          <p className="growth-math-note">
            These aren&rsquo;t promises or projections &mdash; just a picture of how a chapter
            model scales differently than a single club ever could. And chapters aren&rsquo;t
            capped there; each one can grow well beyond its starting size.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
