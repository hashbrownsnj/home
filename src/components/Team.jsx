import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { team } from '../data/team.js'

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

function MemberLinks({ member }) {
  if (!member.github && !member.linkedin) return null

  return (
    <div className="team-card-links">
      {member.github && (
        <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${member.name} on GitHub`}>
          <GitHubIcon />
          GitHub
        </a>
      )}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${member.name} on LinkedIn`}>
          <LinkedInIcon />
          LinkedIn
        </a>
      )}
    </div>
  )
}

function MemberCard({ member, index }) {
  return (
    <article className="team-member-layer" style={{ '--member-index': index }}>
      <div className="team-member-chip" aria-hidden="true">
        <span>0{index + 1}</span>
        <strong>{member.initials}</strong>
      </div>

      <div className="team-member-card">
        <div className="team-card-top">
          <div className="team-card-avatar" aria-hidden="true">
            <span className="team-card-initials">{member.initials}</span>
          </div>
          <div className="team-card-info">
            <h3 className="team-card-name">{member.name}</h3>
            <p className="team-card-role">{member.role}</p>
            {member.venture && (
              <a href={member.venture.url} target="_blank" rel="noopener noreferrer" className="venture-badge">
                <span className="venture-badge-dot" />
                {member.venture.role} @ {member.venture.name}
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>

        <blockquote className="team-card-quote">&ldquo;{member.quote}&rdquo;</blockquote>
        <p className="team-card-bio">{member.bio}</p>

        <div className="team-skill-grid" aria-label={`${member.name} skills`}>
          {member.skills.map((skill) => (
            <span key={skill} className="team-skill-tag">{skill}</span>
          ))}
        </div>

        <MemberLinks member={member} />
      </div>
    </article>
  )
}

export default function Team() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="team" className="team-section team-section--scroll">
      <motion.div
        className="team-header"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="section-title center">THE <span className="accent">TEAM</span></h2>
        <p className="section-sub center">Scroll the single showcase. Four people. One standard.</p>
      </motion.div>

      <motion.div
        className="team-scroll-stage"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="team-scroll-content">
          <div className="team-scroll-copy">
            <p className="showcase-kicker">CSS SCROLL · SUBGRID</p>
            <h3>Meet each member, one scroll beat at a time.</h3>
            <p>Cards stay readable and links stay clickable while the native CSS view-timeline brings each profile forward in sequence.</p>
          </div>

          <div className="team-scroll-grid">
            {team.map((member, index) => (
              <MemberCard key={member.name} member={member} index={index} />
            ))}
            <div className="team-scroll-core" aria-hidden="true">
              <span>HB</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
