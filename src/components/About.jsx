import { motion, useReducedMotion } from 'framer-motion'

const SCROLL_IN = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

const STAGGER_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
}

const PILLARS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Security First',
    body: "Every line of code gets the attacker's read before it ships.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Built to Scale',
    body: "Infrastructure that doesn't fall over when it matters most.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'No Ugly Ships',
    body: "If it isn't sharp, it doesn't go out the door.",
  },
]

const VIEWPORT = { once: true, amount: 0.2 }

export default function About() {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : SCROLL_IN
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER_CONTAINER

  return (
    <section id="about" className="about-section">
      <div className="about-grid">
        {/* Ghost number */}
        <motion.div
          className="about-num"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          aria-hidden="true"
        >
          01
        </motion.div>

        <div className="about-body">
          <motion.h2
            className="section-title"
            variants={v}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            WHO WE <span className="accent">ARE</span>
          </motion.h2>

          <motion.p
            className="about-text"
            variants={v}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            Hash Browns started as a CyberPatriot team and grew into something
            bigger — a crew that ships real software, breaks real systems
            (legally), and competes like it actually matters. We don&rsquo;t do
            filler projects. Everything we build has teeth.
          </motion.p>

          {/* Pillars with stagger */}
          <motion.div
            className="about-pillars"
            variants={sv}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {PILLARS.map((pillar) => (
              <motion.div
                key={pillar.title}
                className="pillar"
                variants={prefersReducedMotion ? {} : SCROLL_IN}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }
                }
              >
                <div className="pillar-icon">{pillar.icon}</div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-body">{pillar.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
