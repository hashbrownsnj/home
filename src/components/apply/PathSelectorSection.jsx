import { motion, useReducedMotion } from 'framer-motion'
import PathCards from './PathCards.jsx'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const VIEWPORT = { once: true, amount: 0.2 }

export default function PathSelectorSection({ selectedPath, onSelect }) {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP

  return (
    <section className="apply-section" id="paths">
      <div className="container">
        <motion.p className="apply-eyebrow" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Choose your path
        </motion.p>
        <motion.h2
          className="section-title"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          There are five ways in.
        </motion.h2>
        <motion.p
          className="apply-section-sub"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          Pick whichever one sounds like you right now. You can always do more than one later.
        </motion.p>

        <PathCards selectedPath={selectedPath} onSelect={onSelect} />
      </div>
    </section>
  )
}
