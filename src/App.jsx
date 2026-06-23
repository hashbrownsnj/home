import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
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

function AmbientScrollBackdrop() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleRaw = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1.16, 1.06])
  const blurRaw = useTransform(scrollYProgress, [0, 0.5, 1], ['0px', '14px', '5px'])
  const scale = useSpring(scaleRaw, { stiffness: 70, damping: 28 })

  return (
    <motion.div
      className="ambient-scroll-backdrop"
      style={prefersReducedMotion ? undefined : { scale, filter: blurRaw }}
      aria-hidden="true"
    />
  )
}

function ParallaxSection({ children, intensity = 42 }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yRaw = useTransform(scrollYProgress, [0, 0.5, 1], [intensity, 0, -intensity])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.78, 1, 1, 0.86])
  const y = useSpring(yRaw, { stiffness: 90, damping: 28, mass: 0.6 })

  return (
    <motion.div
      ref={ref}
      className="page-parallax"
      style={prefersReducedMotion ? undefined : { y, opacity }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  // Spring-smooth the progress bar so it doesn't feel mechanical
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 1650)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <AmbientScrollBackdrop />

      {/* Film-grain texture overlay */}
      <div className="grain" aria-hidden="true" />

      <AnimatePresence>{isLoading && <LoaderOverlay />}</AnimatePresence>

      <Nav scrollProgress={scrollProgress} />

      <main>
        <Hero />
        <Ticker />
        <ScrollZoomScene />
        <SpatialZoom />
        <ParallaxSection intensity={34}><About /></ParallaxSection>
        <ParallaxSection intensity={44}><Team /></ParallaxSection>
        <ParallaxSection intensity={40}><Projects /></ParallaxSection>
        <ParallaxSection intensity={36}><PinnedStrip /></ParallaxSection>
        <ParallaxSection intensity={28}><Contact /></ParallaxSection>
      </main>
    </>
  )
}
