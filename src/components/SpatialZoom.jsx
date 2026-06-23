import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'

const ZOOM_ITEMS = [
  { label: 'React',        area: '1 / 1',                   range: [0.02, 0.16] },
  { label: 'Linux',        area: '1 / 2',                   range: [0.08, 0.22] },
  { label: 'OSINT',        area: '1 / 3',                   range: [0.14, 0.28] },
  { label: 'Node',         area: '1 / 4',                   range: [0.20, 0.34] },
  { label: 'Hardening',    area: '2 / 1',                   range: [0.26, 0.40] },
  { label: 'CyberPatriot', area: '2 / 2',                   range: [0.32, 0.46] },
  { label: 'HASH',         area: '2 / 2 / span 2 / span 2', range: [0.36, 0.66], special: true },
  { label: 'Threat Intel', area: '2 / 4',                   range: [0.42, 0.56] },
  { label: 'APIs',         area: '3 / 1',                   range: [0.48, 0.62] },
  { label: 'BROWNS',       area: '3 / 2 / span 1 / span 2', range: [0.54, 0.78], accent: true },
  { label: 'Scaling',      area: '3 / 4',                   range: [0.60, 0.74] },
  { label: 'Product',      area: '4 / 1',                   range: [0.66, 0.80] },
  { label: 'Brand',        area: '4 / 2',                   range: [0.72, 0.86] },
  { label: 'DevOps',       area: '4 / 3',                   range: [0.78, 0.92] },
  { label: 'Ship Fast',    area: '4 / 4',                   range: [0.84, 0.98] },
]

function ZoomItem({ item, progress, prefersReducedMotion }) {
  const [start, end] = item.range
  const mid = start + (end - start) / 2

  const z = useTransform(progress, [start, mid, end], [-1000, item.special ? 60 : 0, 1000])
  const scale = useTransform(progress, [start, mid, end], [0.55, item.special ? 1.05 : 1, 1.35])
  const opacity = useTransform(
    progress,
    [start, start + 0.025, mid, end - 0.025, end],
    [0, 0.72, 1, 0.66, 0],
  )
  const blurPx = useTransform(progress, [start, mid, end], [7, 0, 7])
  const filter = useMotionTemplate`blur(${blurPx}px)`
  const transform = useMotionTemplate`translate3d(0px, 0px, ${z}px) scale(${scale})`

  return (
    <motion.div
      className={`spatial-zoom-item${item.special ? ' spatial-zoom-item--special' : ''}${item.accent ? ' spatial-zoom-item--accent' : ''}`}
      style={{
        gridArea: item.area,
        ...(prefersReducedMotion ? {} : { transform, opacity, filter }),
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.55,
    restDelta: 0.0006,
  })

  return (
    <section
      className="spatial-zoom-section"
      ref={sectionRef}
      aria-label="Technology stack spatial scroll effect"
    >
      <div className="spatial-zoom-sticky">
        <div className="spatial-zoom-aura" aria-hidden="true" />
        <div className="spatial-zoom-grid" aria-hidden="true">
          {ZOOM_ITEMS.map((item) => (
            <ZoomItem
              key={`${item.label}-${item.area}`}
              item={item}
              progress={smoothProgress}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
