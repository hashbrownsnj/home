import { motion, useReducedMotion } from 'framer-motion'
import { team } from '../data/team.js'

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

const VIEWPORT = { once: true, amount: 0.1 }

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

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Team() {
  const prefersReducedMotion = useReducedMotion()
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER
  const cv = prefersReducedMotion ? { hidden: {}, visible: {} } : CARD_VARIANTS

  return (
    <section id="team" className="team-section">
      <motion.div
        className="team-header"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="section-title center">
          THE <span className="accent">TEAM</span>
        </h2>
        <p className="section-sub center">Four people. One standard.</p>
      </motion.div>

      <motion.div
        className="team-grid"
        variants={sv}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {team.map((member) => (
          <motion.article
            key={member.name}
            className="team-card"
            variants={cv}
            tabIndex={0}
            whileHover={
              prefersReducedMotion
                ? {}
                : { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }
            }
          >
            <div className="team-card-flipper">
              <div className="team-card-face team-card-front">
                {/* Avatar + name row */}
                <div className="team-card-top">
                  <div className="team-card-avatar" aria-hidden="true">
                    <span className="team-card-initials">{member.initials}</span>
                  </div>
                  <div className="team-card-info">
                    <h3 className="team-card-name">{member.name}</h3>
                    <p className="team-card-role">{member.role}</p>
                    {member.venture && (
                      <a
                        href={member.venture.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="venture-badge"
                      >
                        <span className="venture-badge-dot" />
                        {member.venture.role} @ {member.venture.name}
                        <ExternalLinkIcon />
                      </a>
                    )}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="team-card-quote">
                  &ldquo;{member.quote}&rdquo;
                </blockquote>

                {/* Bio */}
                <p className="team-card-bio">{member.bio}</p>

                {/* Social links */}
                {(member.github || member.linkedin) && (
                  <div className="team-card-links">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label={`${member.name} on GitHub`}
                      >
                        <GitHubIcon />
                        GitHub
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <LinkedInIcon />
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="team-card-face team-card-back" aria-label={`${member.name} skills`}>
                <p className="team-card-back-kicker">CORE STACK</p>
                <h3 className="team-card-back-name">{member.name}</h3>
                <div className="team-skill-grid">
                  {member.skills.map((skill) => (
                    <span key={skill} className="team-skill-tag">{skill}</span>
                  ))}
                </div>
                <p className="team-card-back-hint">Hover or focus away to return to bio.</p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
