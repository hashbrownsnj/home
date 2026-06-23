import { motion, useReducedMotion } from 'framer-motion'

const ITEMS = [
  'THREAT INTELLIGENCE',
  'SYSTEMS ARCHITECTURE',
  'CYBERPATRIOT',
  'HACKATHONS',
  'PENETRATION TESTING',
  'ALWAYS GOLD',
  'ZERO DAYS',
  'FULL STACK',
]

export default function Ticker() {
  const prefersReducedMotion = useReducedMotion()

  // Duplicate 3× so the seamless loop works at -33.333%
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="ticker" aria-hidden="true">
      <motion.div
        className="ticker-track"
        animate={prefersReducedMotion ? {} : { x: ['0%', '-33.333%'] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="ticker-sep">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
