import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Ticker from './components/Ticker.jsx'
import SpatialZoom from './components/SpatialZoom.jsx'
import ScrollZoomScene from './components/ScrollZoomScene.jsx'
import About from './components/About.jsx'
import Team from './components/Team.jsx'
import Projects from './components/Projects.jsx'
import PinnedStrip from './components/PinnedStrip.jsx'
import Contact from './components/Contact.jsx'

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

      <Nav />

      <main>
        <Hero />
        <Ticker />
        <ScrollZoomScene />
        <SpatialZoom />
        <About />
        <Team />
        <Projects />
        <PinnedStrip />
        <Contact />
      </main>
    </>
  )
}
