import { motion, useReducedMotion } from 'framer-motion'
import { socials } from '../data/team.js'

const FADE_UP = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const VIEWPORT = { once: true, amount: 0.2 }

const CONTACT_ITEMS = [
  {
    platform: 'LinkedIn',
    handle: 'Hash Browns Co.',
    url: socials.linkedinCompany,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    platform: 'GitHub',
    handle: '@HashBrownsNj',
    url: socials.githubCompany,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER

  return (
    <section id="connect" className="contact-section">
      <div className="contact-inner">
        {/* Eyebrow */}
        <motion.p
          className="contact-eyebrow"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          [ GET IN TOUCH ]
        </motion.p>

        {/* Title with outlined variant */}
        <motion.h2
          className="contact-title"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          LET&rsquo;S{' '}
          <span className="contact-title-outlined">CONNECT</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="contact-sub"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          Find the team. Find the code. Find the work.
        </motion.p>

        {/* Contact cards */}
        <motion.div
          className="contact-cards"
          variants={sv}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {CONTACT_ITEMS.map((item) => (
            <motion.a
              key={item.platform}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              variants={prefersReducedMotion ? {} : FADE_UP}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }
              }
            >
              <div className="contact-card-left">
                <span className="contact-card-platform">{item.platform}</span>
                <span className="contact-card-handle">{item.handle}</span>
              </div>
              <span className="contact-card-arrow" aria-hidden="true">→</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-copy">
          &copy; 2026 Hash Browns — Student Cybersecurity &amp; Hackathon Team
        </span>
        <span className="footer-accent">ALWAYS GOLD</span>
      </footer>
    </section>
  )
}
