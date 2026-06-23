import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'

const ZOOM_ITEMS = [
  { label: 'React', area: '1 / 1', range: [0.02, 0.18] },
  { label: 'Linux', area: '1 / 2', range: [0.08, 0.24] },
  { label: 'OSINT', area: '1 / 3', range: [0.18, 0.34] },
  { label: 'Node', area: '1 / 4', range: [0.04, 0.2] },
  { label: 'Hardening', area: '2 / 1', range: [0.28, 0.44] },
  { label: 'CyberPatriot', area: '2 / 2', range: [0.12, 0.28] },
  { label: 'HASH', area: '2 / 2 / span 2 / span 2', range: [0.32, 0.72], special: true },
  { label: 'Threat Intel', area: '2 / 4', range: [0.42, 0.58] },
  { label: 'APIs', area: '3 / 1', range: [0.5, 0.66] },
  { label: 'BROWNS', area: '3 / 3 / span 1 / span 2', range: [0.5, 0.9], accent: true },
  { label: 'Scaling', area: '3 / 4', range: [0.62, 0.78] },
  { label: 'Product', area: '4 / 1', range: [0.7, 0.86] },
  { label: 'Brand', area: '4 / 2', range: [0.56, 0.72] },
  { label: 'DevOps', area: '4 / 3', range: [0.78, 0.94] },
  { label: 'Ship Fast', area: '4 / 4', range: [0.82, 0.98] },
]

function ZoomItem({ item, progress, prefersReducedMotion }) {
  const [start, end] = item.range
  const mid = start + (end - start) / 2
  const z = useTransform(progress, [start, mid, end], [-950, 0, 950])
  const scale = useTransform(progress, [start, mid, end], [0.52, item.special ? 1.1 : 1, 1.38])
  const opacity = useTransform(progress, [start, mid, end], [0, item.special ? 1 : 0.86, 0])
  const blur = useTransform(progress, [start, mid, end], [9, 0, 11])
  const rotate = useTransform(progress, [start, mid, end], [-10, 0, 10])
  const transform = useMotionTemplate`translateZ(${z}px) scale(${scale}) rotate(${rotate}deg)`
  const filter = useMotionTemplate`blur(${blur}px)`

  return (
    <motion.div
      className={`spatial-zoom-item${item.special ? ' spatial-zoom-item--special' : ''}${item.accent ? ' spatial-zoom-item--accent' : ''}`}
      style={{
        gridArea: item.area,
        transform: prefersReducedMotion ? undefined : transform,
        opacity: prefersReducedMotion ? 1 : opacity,
        filter: prefersReducedMotion ? undefined : filter,
      }}
    >
      {item.special ? <b>{item.label}</b> : item.label}
    </motion.div>
  )
}

export default function SpatialZoom() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  return (
    <section className="spatial-zoom-section" ref={sectionRef} aria-labelledby="spatial-zoom-title">
      <div className="spatial-zoom-sticky">
        <div className="spatial-zoom-copy">
          <p className="spatial-zoom-kicker">SCROLL DEPTH</p>
          <h2 id="spatial-zoom-title">A stack with dimension.</h2>
        </div>

        <div className="spatial-zoom-grid" aria-hidden="true">
          {ZOOM_ITEMS.map((item) => (
            <ZoomItem
              key={`${item.label}-${item.area}`}
              item={item}
              progress={scrollYProgress}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
