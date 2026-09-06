import { motion, useReducedMotion } from 'framer-motion'

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function ApplyHero({ onStart }) {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP

  return (
    <section className="apply-hero" id="apply-top">
      <div className="apply-hero-grid-overlay" aria-hidden="true" />
      <div className="container apply-hero-inner">
        <motion.p
          className="apply-eyebrow"
          initial="hidden"
          animate="visible"
          variants={v}
        >
          Applications open
        </motion.p>

        <motion.h1
          className="apply-hero-title"
          initial="hidden"
          animate="visible"
          variants={v}
          transition={{ delay: 0.08 }}
        >
          Find your place at Hash Browns.
        </motion.h1>

        <motion.p
          className="apply-hero-sub"
          initial="hidden"
          animate="visible"
          variants={v}
          transition={{ delay: 0.16 }}
        >
          Cybersecurity needs more people in it. Communities need more people willing to lead
          them. You don&rsquo;t need to already be an expert to start &mdash; you just need to
          start somewhere. Whether that&rsquo;s learning your first concept, leading your
          school&rsquo;s team, or building a chapter from nothing, there&rsquo;s a real place
          for you here.
        </motion.p>

        <motion.div
          className="apply-hero-actions"
          initial="hidden"
          animate="visible"
          variants={v}
          transition={{ delay: 0.24 }}
        >
          <button type="button" className="btn btn-primary" onClick={onStart}>
            Find your path
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
          <a href="#not-sure" className="btn btn-ghost">
            Not sure yet? Start here
          </a>
        </motion.div>
      </div>
    </section>
  )
}
