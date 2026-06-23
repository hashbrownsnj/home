import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { team } from '../data/team.js'

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

const EASE = [0.16, 1, 0.3, 1]
const EASE_OUT = [0.22, 1, 0.36, 1]

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

  return (
    <section id="team" className="team-section">
      <motion.div
        className="team-header"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <h2 className="section-title center">THE <span className="accent">TEAM</span></h2>
        <p className="section-sub center">Four people. One standard.</p>
      </motion.div>

      {/* Grid */}
      <div className="team-grid-clean">
        {team.map((member, i) => (
          <motion.article
            key={member.name}
            layoutId={`card-${member.name}`}
            className="tcard"
            onClick={() => open(member)}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: EASE, delay: i * 0.08 }}
            whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.25 } }}
            role="button"
            tabIndex={0}
            aria-label={`View ${member.name} profile`}
            onKeyDown={(e) => e.key === 'Enter' && open(member)}
          >
            <div className="tcard-avatar">
              <span>{member.initials}</span>
            </div>
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
          </motion.article>
        ))}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              className="team-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
            />

            {/* Expanded card */}
            <motion.div
              layoutId={`card-${selected.name}`}
              className="team-expanded"
              initial={false}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE_OUT }}
            >
              {/* Close */}
              <button className="team-expanded-close" onClick={close} aria-label="Close">
                <CloseIcon />
              </button>

              {/* Header */}
              <div className="team-exp-header">
                <div className="team-exp-avatar">
                  <span>{selected.initials}</span>
                </div>
                <div>
                  <h2 className="team-exp-name">{selected.name}</h2>
                  <p className="team-exp-role">{selected.role}</p>
                  {selected.venture && (
                    <a href={selected.venture.url} target="_blank" rel="noopener noreferrer" className="venture-badge">
                      <span className="venture-badge-dot" />
                      {selected.venture.role} @ {selected.venture.name}
                      <ExternalLinkIcon />
                    </a>
                  )}
                </div>
              </div>

              {/* Quote */}
              <motion.blockquote
                className="team-exp-quote"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
              >
                &ldquo;{selected.quote}&rdquo;
              </motion.blockquote>

              {/* Bio */}
              <motion.p
                className="team-exp-bio"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27, duration: 0.5, ease: EASE }}
              >
                {selected.bio}
              </motion.p>

              {/* Skills */}
              <motion.div
                className="team-exp-skills"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.45, ease: EASE }}
              >
                {selected.skills.map(s => (
                  <span key={s} className="team-skill-tag">{s}</span>
                ))}
              </motion.div>

              {/* Links */}
              {(selected.github || selected.linkedin) && (
                <motion.div
                  className="team-exp-links"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
