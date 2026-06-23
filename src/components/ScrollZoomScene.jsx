import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const SCENE_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1200">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#102044"/>
      <stop offset="0.48" stop-color="#07101d"/>
      <stop offset="1" stop-color="#02050a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="42%">
      <stop offset="0" stop-color="#60a5fa" stop-opacity="0.75"/>
      <stop offset="0.36" stop-color="#2563eb" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#02050a" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0v72" fill="none" stroke="#e8edf5" stroke-opacity="0.08" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="1800" height="1200" fill="url(#sky)"/>
  <rect width="1800" height="1200" fill="url(#grid)"/>
  <circle cx="900" cy="485" r="520" fill="url(#glow)" filter="url(#soft)"/>
  <path d="M0 860C230 780 390 820 590 745c175-66 324-185 526-132 175 46 315 184 684 112v475H0Z" fill="#05070a" opacity="0.94"/>
  <path d="M140 905c230-56 366-37 520-94 120-44 234-139 395-104 172 37 289 143 605 104" fill="none" stroke="#60a5fa" stroke-opacity="0.34" stroke-width="5"/>
  <g fill="#e8edf5" opacity="0.72">
    <circle cx="210" cy="180" r="4"/><circle cx="430" cy="260" r="3"/><circle cx="1330" cy="215" r="4"/><circle cx="1510" cy="390" r="3"/><circle cx="1110" cy="150" r="2"/>
  </g>
  <text x="900" y="535" text-anchor="middle" font-family="Syne, Arial, sans-serif" font-size="180" font-weight="800" letter-spacing="-14" fill="#e8edf5" opacity="0.16">HASH</text>
</svg>`)}`

export default function ScrollZoomScene() {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 78,
    damping: 24,
    mass: 0.55,
    restDelta: 0.0007,
  })

  const imageScale = useTransform(smoothProgress, [0, 1], [1, 2])
  const imageZ = useTransform(smoothProgress, [0, 1], [0, 250])
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.4])
  const darkness = useTransform(smoothProgress, [0, 0.85], [0, 0.76])
  const titleY = useTransform(smoothProgress, [0, 1], [0, -80])
  const titleOpacity = useTransform(smoothProgress, [0, 0.72, 1], [1, 0.82, 0.3])
  const imgTransform = useMotionTemplate`translateZ(${imageZ}px) scale(${imageScale})`

  const motionStyles = prefersReducedMotion
    ? undefined
    : { transform: imgTransform }

  return (
    <section className="scroll-zoom-scene" ref={ref} aria-label="Scroll-driven Hash Browns visual zoom">
      <div className="scroll-zoom-sticky">
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
        <div className="scroll-zoom-image-container" aria-hidden="true">
          <motion.img
            src={SCENE_IMAGE}
            alt=""
            className="scroll-zoom-image"
            style={motionStyles}
          />
        </div>
        <motion.div
          className="scroll-zoom-intro"
          style={prefersReducedMotion ? undefined : { y: titleY, opacity: titleOpacity }}
        >
          <p className="showcase-kicker">FRAMER SCROLL ZOOM</p>
          <h2>Depth without GSAP.</h2>
          <p>Scroll through a pinned, cinematic image zoom built with Framer Motion transforms.</p>
        </motion.div>
      </div>
    </section>
  )
}
