import { useEffect, useRef, useState } from 'react'
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

const BUILD_LINES = [
  'shipping secure web apps',
  'hardening competition images',
  'designing sharper student tools',
]

const TYPE_SPEED = 54
const DELETE_SPEED = 28
const HOLD_TIME = 1350

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
  const [typedText, setTypedText] = useState(BUILD_LINES[0])

  const reducedVariant = { hidden: {}, visible: {} }

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText(BUILD_LINES[0])
      return undefined
    }

    let lineIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId

    const tick = () => {
      const currentLine = BUILD_LINES[lineIndex]
      setTypedText(currentLine.slice(0, charIndex))

      if (!deleting && charIndex < currentLine.length) {
        charIndex += 1
        timeoutId = window.setTimeout(tick, TYPE_SPEED)
        return
      }

      if (!deleting && charIndex === currentLine.length) {
        deleting = true
        timeoutId = window.setTimeout(tick, HOLD_TIME)
        return
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1
        timeoutId = window.setTimeout(tick, DELETE_SPEED)
        return
      }

      deleting = false
      lineIndex = (lineIndex + 1) % BUILD_LINES.length
      timeoutId = window.setTimeout(tick, TYPE_SPEED)
    }

    timeoutId = window.setTimeout(tick, 500)
    return () => window.clearTimeout(timeoutId)
  }, [prefersReducedMotion])

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

        <motion.div
          className="hero-terminal"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.74)}
          initial="hidden"
          animate="visible"
          aria-label={`Currently building ${typedText}`}
        >
          <span className="hero-terminal-prompt">~/currently-building</span>
          <span className="hero-terminal-command">{typedText}</span>
          <span className="hero-terminal-cursor" aria-hidden="true" />
        </motion.div>

        {/* Description */}
        <motion.p
          className="hero-desc"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.82)}
          initial="hidden"
          animate="visible"
        >
          We&rsquo;re a small team of student developers building things that matter
          to us — fast, sharp, and without cutting corners. Cybersecurity runs
          through everything we do. So does a stubborn refusal to ship anything ugly.
        </motion.p>

        <motion.blockquote
          className="hero-quote"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(0.9)}
          initial="hidden"
          animate="visible"
        >
          <p>
            &ldquo;The people who are crazy enough to think they can change the
            world are the ones who do.&rdquo;
          </p>
          <cite>— Steve Jobs</cite>
        </motion.blockquote>

        {/* CTAs */}
        <motion.div
          className="hero-cta"
          variants={prefersReducedMotion ? reducedVariant : FADE_UP(1.04)}
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
