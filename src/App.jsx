import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Apply from './pages/Apply.jsx'

function LoaderOverlay() {
  return (
    <motion.div
      className="loader-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <motion.div
        className="loader-mark"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        HB
      </motion.div>
      <div className="loader-track">
        <motion.div
          className="loader-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.35, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </motion.div>
  )
}

// Handles cross-page hash links (e.g. navigating from /apply to /#about)
// and resets scroll position to the top on a plain route change.
function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      // Wait a tick for the target route to render before measuring/scrolling.
      const raf = window.requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => window.cancelAnimationFrame(raf)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname, location.hash])

  return null
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 1650)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <div className="ambient-scroll-backdrop" aria-hidden="true" />

      {/* Film-grain texture overlay */}
      <div className="grain" aria-hidden="true" />

      <AnimatePresence>{isLoading && <LoaderOverlay />}</AnimatePresence>

      <ScrollManager />
      <Nav />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
        </Routes>
      </main>
    </>
  )
}
