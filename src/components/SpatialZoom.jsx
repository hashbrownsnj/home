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
  { label: 'React', area: '1 / 1', range: [0.02, 0.3], drift: [-8, -4] },
  { label: 'Linux', area: '1 / 2', range: [0.05, 0.34], drift: [2, -6] },
  { label: 'OSINT', area: '1 / 3', range: [0.09, 0.38], drift: [5, -5] },
  { label: 'Node', area: '1 / 4', range: [0.13, 0.42], drift: [8, -4] },
  { label: 'Hardening', area: '2 / 1', range: [0.18, 0.48], drift: [-10, 1] },
  { label: 'CyberPatriot', area: '2 / 2', range: [0.21, 0.52], drift: [-4, 0] },
  { label: 'HASH', area: '2 / 2 / span 2 / span 2', range: [0.26, 0.78], special: true, drift: [0, 0] },
  { label: 'Threat Intel', area: '2 / 4', range: [0.34, 0.64], drift: [10, 1] },
  { label: 'APIs', area: '3 / 1', range: [0.42, 0.72], drift: [-9, 4] },
  { label: 'BROWNS', area: '3 / 3 / span 1 / span 2', range: [0.45, 0.92], accent: true, drift: [2, 2] },
  { label: 'Scaling', area: '3 / 4', range: [0.5, 0.8], drift: [8, 3] },
  { label: 'Product', area: '4 / 1', range: [0.58, 0.88], drift: [-8, 7] },
  { label: 'Brand', area: '4 / 2', range: [0.62, 0.92], drift: [-2, 6] },
  { label: 'DevOps', area: '4 / 3', range: [0.66, 0.96], drift: [4, 6] },
  { label: 'Ship Fast', area: '4 / 4', range: [0.7, 1], drift: [8, 7] },
]

function ZoomItem({ item, progress, prefersReducedMotion }) {
  const [start, end] = item.range
  const mid = start + (end - start) / 2
  const [driftX, driftY] = item.drift
  const z = useTransform(progress, [start, mid, end], [-1150, item.special ? 80 : 0, 1150])
  const x = useTransform(progress, [start, mid, end], [driftX * -1, 0, driftX])
  const y = useTransform(progress, [start, mid, end], [driftY * -1, 0, driftY])
  const scale = useTransform(progress, [start, mid, end], [0.44, item.special ? 1.08 : 1, 1.52])
  const opacity = useTransform(progress, [start, start + 0.05, mid, end - 0.05, end], [0, 0.56, item.special ? 1 : 0.9, 0.5, 0])
  const blur = useTransform(progress, [start, mid, end], [12, 0, 13])
  const rotate = useTransform(progress, [start, mid, end], [-7, 0, 7])
  const transform = useMotionTemplate`translate3d(${x}vw, ${y}vh, ${z}px) scale(${scale}) rotate(${rotate}deg)`
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
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.6,
    restDelta: 0.0006,
  })

  return (
    <section className="spatial-zoom-section" ref={sectionRef} aria-label="Technology stack spatial scroll effect">
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
