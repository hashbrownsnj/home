import { motion, useReducedMotion } from 'framer-motion'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const VIEWPORT = { once: true, amount: 0.3 }

export default function FinalCTA({ onStart }) {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP

  return (
    <section className="apply-final-cta">
      <div className="container">
        <motion.h2 className="apply-final-cta-title" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          The next chapter could start with you.
        </motion.h2>
        <motion.p className="apply-final-cta-sub" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Don&rsquo;t wait for someone else to build the community you wish existed.
        </motion.p>
        <motion.div variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <button type="button" className="btn btn-primary" onClick={onStart}>
            Start your application
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </motion.div>
        <motion.p
          className="apply-final-cta-note"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          Not sure where to begin? We&rsquo;ll help you find your place.
        </motion.p>
      </div>
    </section>
  )
}
