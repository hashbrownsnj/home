import { motion, useReducedMotion } from 'framer-motion'

const STATS = [
  { value: '4',  label: 'Core Members' },
  { value: '2',  label: 'Shipped Products' },
  { value: '0',  label: 'Corners Cut' },
]

const VIEWPORT = { once: true, amount: 0.3 }

export default function PinnedStrip() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="pinned-strip">
      <div className="pinned-inner">
        {/* Editorial quote */}
        <motion.blockquote
          className="pinned-quote"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="pinned-quote-mark">&ldquo;</span>
          We compete against teams that have been doing this for years.
          We ship anyway.
          <span className="pinned-quote-mark">&rdquo;</span>
        </motion.blockquote>

        {/* Stats */}
        <div className="pinned-stats">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="pinned-stat"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
            >
              <span className="pinned-stat-value">{stat.value}</span>
              <span className="pinned-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
