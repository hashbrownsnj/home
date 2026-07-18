import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Projects', href: '#projects' },
  { label: 'Connect', href: '#connect' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={prefersReducedMotion ? {} : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div className="nav-inner">
          <a href="#top" className="nav-logo" onClick={closeMenu}>
            HASH<span>BROWNS</span>
          </a>

          {/* Desktop nav */}
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

          {/* Mobile burger */}
          <button
            className={`nav-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="nav-burger-bar" />
            <span className="nav-burger-bar" />
            <span className="nav-burger-bar" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay menu */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="nav-mobile-link"
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
        <div className="nav-mobile-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </div>
    </>
  )
}
