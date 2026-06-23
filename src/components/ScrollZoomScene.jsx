import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const SCENE_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1200">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#060d1a"/>
      <stop offset="0.48" stop-color="#03080f"/>
      <stop offset="1" stop-color="#010306"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="42%">
      <stop offset="0" stop-color="#3b82f6" stop-opacity="0.9"/>
      <stop offset="0.36" stop-color="#1d4ed8" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#010306" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="20%" cy="80%" r="32%">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#010306" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="sharp"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="led-glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0v80" fill="none" stroke="#3b82f6" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
    <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0v20" fill="none" stroke="#60a5fa" stroke-opacity="0.03" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="1800" height="1200" fill="url(#sky)"/>
  <rect width="1800" height="1200" fill="url(#grid2)"/>
  <rect width="1800" height="1200" fill="url(#grid)"/>
  <circle cx="900" cy="500" r="560" fill="url(#glow)" filter="url(#soft)"/>
  <circle cx="200" cy="900" r="320" fill="url(#glow2)" filter="url(#soft)"/>
  <path d="M0 820C200 760 380 800 560 730c160-62 300-178 500-128 160 42 300 176 740 108v372H0Z" fill="#020509" opacity="0.97"/>
  <line x1="0" y1="822" x2="1800" y2="822" stroke="#3b82f6" stroke-opacity="0.18" stroke-width="1"/>
  <path d="M0 880c280-68 420-44 580-102 130-47 254-152 420-116 178 39 308 152 670 110" fill="none" stroke="#60a5fa" stroke-opacity="0.5" stroke-width="3" filter="url(#sharp)"/>
  <path d="M0 880c280-68 420-44 580-102 130-47 254-152 420-116 178 39 308 152 670 110" fill="none" stroke="#93c5fd" stroke-opacity="0.25" stroke-width="8" filter="url(#soft)"/>
  <g fill="#e8edf5">
    <circle cx="130" cy="120" r="2.5" opacity="0.9"/><circle cx="290" cy="80" r="1.5" opacity="0.6"/>
    <circle cx="480" cy="200" r="2" opacity="0.7"/><circle cx="650" cy="95" r="3" opacity="0.8"/>
    <circle cx="820" cy="55" r="1.5" opacity="0.5"/><circle cx="1020" cy="115" r="2.5" opacity="0.9"/>
    <circle cx="1180" cy="70" r="2" opacity="0.6"/><circle cx="1340" cy="160" r="1.5" opacity="0.7"/>
    <circle cx="1480" cy="90" r="3" opacity="0.8"/><circle cx="1620" cy="200" r="2" opacity="0.6"/>
    <circle cx="1720" cy="130" r="2.5" opacity="0.9"/>
  </g>
  <g filter="url(#led-glow)">
    <circle cx="360" cy="780" r="3" fill="#60a5fa" opacity="0.8"/>
    <circle cx="720" cy="760" r="2" fill="#a78bfa" opacity="0.7"/>
    <circle cx="1080" cy="770" r="3" fill="#60a5fa" opacity="0.8"/>
    <circle cx="1440" cy="755" r="2.5" fill="#818cf8" opacity="0.7"/>
    <circle cx="900" cy="750" r="4" fill="#3b82f6" opacity="0.9"/>
    <circle cx="1620" cy="790" r="2" fill="#60a5fa" opacity="0.7"/>
  </g>
</svg>`)}`

export default function ScrollZoomScene() {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 68,
    damping: 22,
    mass: 0.6,
    restDelta: 0.0005,
  })

  // Use Framer's individual transform props so perspective is respected.
  // scale + z as separate props compose correctly with the parent perspective.
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 2.2])
  const imageZ     = useTransform(smoothProgress, [0, 1], [0, 280])
  const heroScale  = useTransform(smoothProgress, [0, 1], [1, 1.5])
  const darkness   = useTransform(smoothProgress, [0, 0.7, 1], [0, 0.5, 0.82])

  // Text fades in mid-scroll, out near end
  const textY       = useTransform(smoothProgress, [0.08, 0.35], [60, 0])
  const textOpacity = useTransform(smoothProgress, [0.08, 0.32, 0.78, 0.95], [0, 1, 1, 0])
  const subY        = useTransform(smoothProgress, [0.18, 0.44], [40, 0])
  const subOpacity  = useTransform(smoothProgress, [0.18, 0.42, 0.78, 0.95], [0, 1, 1, 0])

  // LED scan line sweeps top→bottom as you scroll
  const scanY = useTransform(smoothProgress, [0, 1], ['-4%', '104%'])

  return (
    <section
      className="scroll-zoom-scene"
      ref={ref}
      aria-label="Scroll-driven Hash Browns visual zoom"
    >
      <div className="scroll-zoom-sticky">

        {/* Background layers */}
        <motion.div
          className="scroll-zoom-hero"
          style={prefersReducedMotion ? undefined : { scale: heroScale }}
          aria-hidden="true"
        />
        <motion.div
          className="scroll-zoom-darken"
          style={prefersReducedMotion ? undefined : { opacity: darkness }}
          aria-hidden="true"
        />

        {/*
          KEY FIX: The image container sets perspective. The img itself uses
          Framer's z + scale props (not a template string) so the browser can
          apply the perspective transform correctly without the two transforms
          fighting each other.
        */}
        <div className="scroll-zoom-image-container" aria-hidden="true">
          <motion.img
            src={SCENE_IMAGE}
            alt=""
            className="scroll-zoom-image"
            style={
              prefersReducedMotion
                ? undefined
                : {
                    scale: imageScale,
                    z: imageZ,
                    transformOrigin: 'center center',
                  }
            }
          />
        </div>

        {/* LED scan line */}
        {!prefersReducedMotion && (
          <motion.div
            className="szs-scanline"
            style={{ top: scanY }}
            aria-hidden="true"
          />
        )}

        {/* Cinematic overlay text — visible mid-scroll */}
        <div className="scroll-zoom-intro">
          <motion.p
            className="szs-kicker"
            style={prefersReducedMotion ? {} : { y: subY, opacity: subOpacity }}
          >
            HASH BROWNS COLLECTIVE
          </motion.p>
          <motion.h2
            className="szs-headline"
            style={prefersReducedMotion ? {} : { y: textY, opacity: textOpacity }}
          >
            Built in the{' '}
            <em className="szs-em">dark.</em>
            <br />
            Shipped in the{' '}
            <em className="szs-em-blue">light.</em>
          </motion.h2>
          <motion.p
            className="szs-sub"
            style={prefersReducedMotion ? {} : { y: subY, opacity: subOpacity }}
          >
            Four students. One standard. Zero corners cut.
          </motion.p>
        </div>

      </div>
    </section>
  )
}
