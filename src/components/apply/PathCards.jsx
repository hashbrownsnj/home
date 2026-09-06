import { motion, useReducedMotion } from 'framer-motion'
import { APPLICATION_PATHS } from '../../data/applyData.js'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function PathCards({ selectedPath, onSelect, size = 'default' }) {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER

  return (
    <motion.div
      className={`path-cards${size === 'compact' ? ' path-cards--compact' : ''}`}
      variants={sv}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {APPLICATION_PATHS.map((path) => {
        const active = selectedPath === path.id
        return (
          <motion.button
            key={path.id}
            type="button"
            className={`path-card${active ? ' path-card--active' : ''}`}
            variants={v}
            onClick={() => onSelect(path.id)}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            aria-pressed={active}
          >
            <span className="path-card-glyph">{path.glyph}</span>
            <span className="path-card-title">{path.title}</span>
            <span className="path-card-desc">{path.short}</span>
            <span className="path-card-foot">
              <span className="path-card-time">{path.estTime}</span>
              <span className="path-card-arrow" aria-hidden="true">→</span>
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
