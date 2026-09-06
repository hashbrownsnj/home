import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const SECTION_LINKS = [
  { label: 'About', hash: '#about' },
  { label: 'Team', hash: '#team' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Connect', hash: '#connect' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const location = useLocation()
  const onHome = location.pathname === '/'

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

  // From the home page, section links stay in-page (#about). From any other
  // route (like /apply), they need to route back to the home page first.
  const sectionHref = (hash) => (onHome ? hash : `/${hash}`)

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={prefersReducedMotion ? {} : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div className="nav-inner">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            HASH<span>BROWNS</span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-links">
            {SECTION_LINKS.map(({ label, hash }) => (
              <a key={label} href={sectionHref(hash)} className="nav-link">
                {label}
              </a>
            ))}
            <Link
              to="/apply"
              className={`nav-link nav-link--cta${location.pathname === '/apply' ? ' is-active' : ''}`}
            >
              Apply
            </Link>
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
        {SECTION_LINKS.map(({ label, hash }) => (
          <a
            key={label}
            href={sectionHref(hash)}
            className="nav-mobile-link"
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
        <Link to="/apply" className="nav-mobile-link nav-mobile-link--cta" onClick={closeMenu}>
          Apply
        </Link>
        <div className="nav-mobile-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </div>
    </>
  )
}
