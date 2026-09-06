import { motion, useReducedMotion } from 'framer-motion'
import { DEPARTMENTS } from '../../data/applyData.js'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const VIEWPORT = { once: true, amount: 0.15 }

export default function DepartmentsSection() {
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP
  const sv = prefersReducedMotion ? { hidden: {}, visible: {} } : STAGGER

  return (
    <section className="apply-section apply-section--alt" id="departments">
      <div className="container">
        <motion.p className="apply-eyebrow" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Department leadership
        </motion.p>
        <motion.h2 className="section-title" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Four departments run the org.
        </motion.h2>
        <motion.p className="apply-section-sub" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Executives lead the organization as a whole. Below them, four departments — up to five
          people each — handle the work that actually makes Hash Browns grow and function.
        </motion.p>

        <motion.div className="department-grid" variants={sv} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {DEPARTMENTS.map((dept) => (
            <motion.div key={dept.id} className="department-card" variants={v}>
              <span className="department-card-name">{dept.name}</span>
              <span className="department-card-tagline">{dept.tagline}</span>
              <p className="department-card-desc">{dept.description}</p>
              <ul className="department-card-list">
                {dept.responsibilities.slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="org-hierarchy"
          variants={v}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <span className="org-hierarchy-eyebrow">How it&rsquo;s structured</span>
          <div className="org-hierarchy-flow">
            {['Executives', 'Departments', 'Chapter leaders', 'Local teams & members', 'Individual competitors & volunteers'].map(
              (level, i, arr) => (
                <span key={level} className="org-hierarchy-step">
                  <span className="org-hierarchy-node">{level}</span>
                  {i < arr.length - 1 && <span className="org-hierarchy-connector" aria-hidden="true">↓</span>}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
