import { useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { projects } from '../data/projects.js'

const STATUS_META = {
  live:     { label: 'LIVE',      cls: 'badge--live' },
  build:    { label: 'IN BUILD',  cls: 'badge--build' },
  archived: { label: 'ARCHIVED',  cls: 'badge--archived' },
}

function getMicrolinkUrl(url) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
}

const CARD = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

const VIEWPORT = { once: true, amount: 0.1 }

function ProjectCover({ project }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const imgUrl = project.cover || getMicrolinkUrl(project.url)

  return (
    <div className="project-cover">
      {!failed && (
        <img
          src={imgUrl}
          alt={`${project.title} preview`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ opacity: loaded ? undefined : 0, transition: 'opacity 0.5s' }}
        />
      )}
      {(failed || !loaded) && (
        <div className="project-cover-placeholder" aria-hidden="true">
          {project.title.slice(0, 2)}
        </div>
      )}
      <div className="project-cover-overlay" aria-hidden="true" />
      <span className={`status-badge ${STATUS_META[project.status]?.cls ?? 'badge--build'}`}>
        {STATUS_META[project.status]?.label ?? 'IN BUILD'}
      </span>
    </div>
  )
}

function ProjectCard({ project, variants, prefersReducedMotion }) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateXRaw = useTransform(pointerY, [-0.5, 0.5], [13, -13])
  const rotateYRaw = useTransform(pointerX, [-0.5, 0.5], [-15, 15])
  const rotateX = useSpring(rotateXRaw, { stiffness: 260, damping: 24 })
  const rotateY = useSpring(rotateYRaw, { stiffness: 260, damping: 24 })

  function handlePointerMove(event) {
    if (prefersReducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function resetTilt() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.article
      className="project-card"
      variants={variants}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={
        prefersReducedMotion
          ? {}
          : { y: -10, scale: 1.015, transition: { type: 'spring', stiffness: 300, damping: 20 } }
      }
    >
      <ProjectCover project={project} />

      <div className="project-body">
        <div className="project-meta">
          <span className="project-year">{project.year}</span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="project-actions">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            Visit <span className="btn-arrow">→</span>
          </a>
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              Source
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const prefersReducedMotion = useReducedMotion()
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER
  const cv = prefersReducedMotion ? { hidden: {}, visible: {} } : CARD

  return (
    <section id="projects" className="projects-section">
      <motion.div
        className="projects-header"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="section-title">
          OUR <span className="accent">WORK</span>
        </h2>
        <p className="section-sub">Live builds. Real repos. No vaporware.</p>
      </motion.div>

      <motion.div className="projects-grid" variants={sv} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            variants={cv}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </motion.div>
    </section>
  )
}
