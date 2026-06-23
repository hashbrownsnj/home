import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Projects', href: '#projects' },
  { label: 'Connect', href: '#connect' },
]

export default function Nav({ scrollProgress }) {
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollProgress, transformOrigin: 'left' }}
      />

      <motion.nav
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={prefersReducedMotion ? {} : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div className="nav-inner">
          <a href="#top" className="nav-logo">
            HASH<span>BROWNS</span>
          </a>

          <div className="nav-links">
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>

          <div className="nav-status">
            <motion.span
              className="status-dot"
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            SYSTEM ONLINE
          </div>
        </div>
      </motion.nav>
    </>
  )
}
