import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

const TITLE_CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const TITLE_WORD = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
}

const FADE_UP = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
  },
})

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const ghostY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.65], [0.042, 0])

  const reducedVariant = { hidden: {}, visible: {} }

  return (
    <section id="top" className="hero" ref={containerRef}>
      {/* Parallax ghost letterform */}
      <motion.div
        className="hero-ghost"
        aria-hidden="true"
        style={
          prefersReducedMotion
            ? { opacity: 0.042 }
            : { y: ghostY, opacity: ghostOpacity }
        }
      >
        HB
      </motion.div>

      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="hero-content">
        {/* Eyebrow tag */}
        <motion.div
          className="hero-tag"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.1)}
          initial="hidden"
          animate="visible"
        >
          <span className="bracket">[</span>
          {' '}CYBERSECURITY · CYBERPATRIOT · HACKATHON{' '}
          <span className="bracket">]</span>
        </motion.div>

        {/* Main headline — staggered words */}
        <motion.h1
          className="hero-title"
          variants={prefersReducedMotion ? reducedVariant : TITLE_CONTAINER}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="hero-title-line"
            variants={prefersReducedMotion ? reducedVariant : TITLE_WORD}
          >
            HASH
          </motion.span>
          <motion.span
            className="hero-title-line hero-title-line--accent"
            variants={prefersReducedMotion ? reducedVariant : TITLE_WORD}
          >
            BROWNS
          </motion.span>
        </motion.h1>

        {/* Sub italic */}
        <motion.p
          className="hero-sub"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.68)}
          initial="hidden"
          animate="visible"
        >
          Always gold. Crispy and hot as hell.
        </motion.p>

        {/* Description */}
        <motion.p
          className="hero-desc"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.82)}
          initial="hidden"
          animate="visible"
        >
          We&rsquo;re a small team of student developers building things that matter
          to us. Fast, sharp, and without cutting corners. Cybersecurity runs
          through everything we do. So does a stubborn refusal to ship anything ugly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="hero-cta"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.96)}
          initial="hidden"
          animate="visible"
        >
          <a href="#projects" className="btn btn-primary">
            View Our Work <span className="btn-arrow">→</span>
          </a>
          <a href="#team" className="btn btn-ghost">
            Meet The Team
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="scroll-cue"
        variants={prefersReducedMotion ? reducedVariant : FADE_UP(1.5)}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        <span className="scroll-cue-label">SCROLL</span>
        <motion.div
          className="scroll-cue-line"
          animate={
            prefersReducedMotion
              ? {}
              : { scaleY: [0, 1, 0] }
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            repeatDelay: 0.4,
          }}
          style={{ transformOrigin: 'top center' }}
        />
      </motion.div>
    </section>
  )
}
