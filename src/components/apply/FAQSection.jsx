import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FAQ_ITEMS } from '../../data/applyData.js'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const VIEWPORT = { once: true, amount: 0.15 }

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const v = prefersReducedMotion ? { hidden: {}, visible: {} } : FADE_UP

  return (
    <section className="apply-section" id="faq">
      <div className="container faq-container">
        <motion.p className="apply-eyebrow" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Questions
        </motion.p>
        <motion.h2 className="section-title" variants={v} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Before you apply.
        </motion.h2>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q} className={`faq-item${open ? ' faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                >
                  <span>{item.q}</span>
                  <span className="faq-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <motion.p
                    className="faq-answer"
                    initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {item.a}
                  </motion.p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
