import { useState, useEffect } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { team } from '../data/team.js'

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

const EASE = [0.16, 1, 0.3, 1]

// LED pulse animation for avatar
const ledVariants = {
  idle: { boxShadow: '0 0 12px rgba(96,165,250,0.3), inset 0 0 12px rgba(96,165,250,0.05)' },
  pulse: { boxShadow: '0 0 32px rgba(96,165,250,0.7), inset 0 0 20px rgba(96,165,250,0.15)' },
}

export default function Team() {
  const [selected, setSelected] = useState(null)
  const prefersReducedMotion = useReducedMotion()

  const open = (member) => {
    setSelected(member)
    document.body.style.overflow = 'hidden'
  }
  const close = () => {
    setSelected(null)
    document.body.style.overflow = ''
  }

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    if (selected) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <section id="team" className="team-section">
      <motion.div
        className="team-header"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p className="team-eyebrow">[ 04 — PEOPLE ]</p>
        <h2 className="section-title center">THE <span className="accent">TEAM</span></h2>
        <p className="section-sub center">Four people. One standard.</p>
      </motion.div>

      <div className="team-grid-clean">
        {team.map((member, i) => (
          <motion.article
            key={member.name}
            className="tcard"
            onClick={() => open(member)}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.09 }}
            whileHover={prefersReducedMotion ? {} : { y: -6, transition: { duration: 0.28 } }}
            role="button"
            tabIndex={0}
            aria-label={`View ${member.name} profile`}
            onKeyDown={(e) => e.key === 'Enter' && open(member)}
          >
            {/* LED corner accent */}
            <span className="tcard-led tcard-led--tl" aria-hidden="true" />
            <span className="tcard-led tcard-led--br" aria-hidden="true" />

            <motion.div
              className="tcard-avatar"
              variants={prefersReducedMotion ? {} : ledVariants}
              initial="idle"
              whileHover="pulse"
              transition={{ duration: 0.4 }}
            >
              <span>{member.initials}</span>
            </motion.div>
            <div className="tcard-body">
              <p className="tcard-index">0{i + 1}</p>
              <h3 className="tcard-name">{member.name}</h3>
              <p className="tcard-role">{member.role}</p>
            </div>
            <div className="tcard-skills">
              {member.skills.slice(0, 3).map(s => (
                <span key={s} className="tcard-skill">{s}</span>
              ))}
            </div>
            <div className="tcard-cta">
              <span>View Profile</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal Portal */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              className="team-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Centering wrapper — the modal itself is only ever positioned by
                flexbox here, so Framer Motion's animated transform never
                fights with a CSS translate(-50%,-50%) offset. */}
            <div className="team-modal-overlay">
              <motion.div
                className="team-modal"
                role="dialog"
                aria-modal="true"
                aria-label={`${selected.name} profile`}
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {/* LED top bar */}
                <div className="team-modal-ledbar" aria-hidden="true">
                  <span className="team-modal-led team-modal-led--red" />
                  <span className="team-modal-led team-modal-led--yellow" />
                  <span className="team-modal-led team-modal-led--green" />
                </div>

                {/* Scrollable body */}
                <div className="team-modal-scroll">

                  {/* Close */}
                  <button className="team-modal-close" onClick={close} aria-label="Close profile">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>

                  {/* Header */}
                  <div className="team-modal-header">
                    <motion.div
                      className="team-modal-avatar"
                      animate={prefersReducedMotion ? {} : {
                        boxShadow: [
                          '0 0 18px rgba(96,165,250,0.4)',
                          '0 0 36px rgba(96,165,250,0.7)',
                          '0 0 18px rgba(96,165,250,0.4)',
                        ]
                      }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <span>{selected.initials}</span>
                    </motion.div>
                    <div className="team-modal-info">
                      <motion.h2
                        className="team-modal-name"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                      >
                        {selected.name}
                      </motion.h2>
                      <motion.p
                        className="team-modal-role"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
                      >
                        {selected.role}
                      </motion.p>
                      {selected.venture && (
                        <motion.a
                          href={selected.venture.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="venture-badge"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.22, duration: 0.4 }}
                        >
                          <span className="venture-badge-dot" />
                          {selected.venture.role} @ {selected.venture.name}
                          <ExternalLinkIcon />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Quote */}
                  <motion.blockquote
                    className="team-modal-quote"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.55, ease: EASE }}
                  >
                    &ldquo;{selected.quote}&rdquo;
                  </motion.blockquote>

                  {/* Bio */}
                  <motion.p
                    className="team-modal-bio"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.55, ease: EASE }}
                  >
                    {selected.bio}
                  </motion.p>

                  {/* Skills */}
                  <motion.div
                    className="team-modal-skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36, duration: 0.45, ease: EASE }}
                  >
                    <p className="team-modal-label">SKILLS</p>
                    <div className="team-modal-skill-list">
                      {selected.skills.map((s, idx) => (
                        <motion.span
                          key={s}
                          className="team-skill-tag"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.38 + idx * 0.04, duration: 0.3 }}
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Social links */}
                  {(selected.github || selected.linkedin) && (
                    <motion.div
                      className="team-modal-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.44, duration: 0.4 }}
                    >
                      {selected.github && (
                        <a href={selected.github} target="_blank" rel="noopener noreferrer" className="social-link">
                          <GitHubIcon /> GitHub
                        </a>
                      )}
                      {selected.linkedin && (
                        <a href={selected.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                          <LinkedInIcon /> LinkedIn
                        </a>
                      )}
                    </motion.div>
                  )}

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}