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
  { label: 'React',        area: '1 / 1',                   range: [0.02, 0.30], drift: [-8, -4] },
  { label: 'Linux',        area: '1 / 2',                   range: [0.05, 0.34], drift: [2,  -6] },
  { label: 'OSINT',        area: '1 / 3',                   range: [0.09, 0.38], drift: [5,  -5] },
  { label: 'Node',         area: '1 / 4',                   range: [0.13, 0.42], drift: [8,  -4] },
  { label: 'Hardening',    area: '2 / 1',                   range: [0.18, 0.48], drift: [-10, 1] },
  { label: 'CyberPatriot', area: '2 / 2',                   range: [0.21, 0.52], drift: [-4,  0] },
  { label: 'HASH',         area: '2 / 2 / span 2 / span 2', range: [0.26, 0.78], special: true, drift: [0, 0] },
  { label: 'Threat Intel', area: '2 / 4',                   range: [0.34, 0.64], drift: [10,  1] },
  { label: 'APIs',         area: '3 / 1',                   range: [0.42, 0.72], drift: [-9,  4] },
  { label: 'BROWNS',       area: '3 / 3 / span 1 / span 2', range: [0.45, 0.92], accent: true, drift: [2, 2] },
  { label: 'Scaling',      area: '3 / 4',                   range: [0.50, 0.80], drift: [8,   3] },
  { label: 'Product',      area: '4 / 1',                   range: [0.58, 0.88], drift: [-8,  7] },
  { label: 'Brand',        area: '4 / 2',                   range: [0.62, 0.92], drift: [-2,  6] },
  { label: 'DevOps',       area: '4 / 3',                   range: [0.66, 0.96], drift: [4,   6] },
  { label: 'Ship Fast',    area: '4 / 4',                   range: [0.70, 1.00], drift: [8,   7] },
]

function ZoomItem({ item, progress, prefersReducedMotion }) {
  const [start, end] = item.range
  const mid = start + (end - start) / 2
  const [driftX, driftY] = item.drift

  /*
    KEY FIX: Use Framer's individual x / y / z / scale / rotate / opacity style
    props instead of a useMotionTemplate translate3d string.

    A template string like `translate3d(${x}vw, ${y}vh, ${z}px) scale(${s})`
    is treated as a raw CSS value and applied AFTER Framer's own transform
    pipeline — meaning it never participates in the parent perspective context.
    That's why items fly off-screen rather than zooming through the centre.

    With individual props (x, y, z, scale, rotate) Framer composes them into
    one matrix that IS evaluated inside the ancestor perspective: 1150px.

    Drift is now in px (small offsets) rather than vw/vh.
  */
  const z       = useTransform(progress, [start, mid, end], [-1150, item.special ? 80 : 0, 1150])
  const x       = useTransform(progress, [start, mid, end], [driftX * -4, 0, driftX * 4])
  const y       = useTransform(progress, [start, mid, end], [driftY * -4, 0, driftY * 4])
  const scale   = useTransform(progress, [start, mid, end], [0.44, item.special ? 1.08 : 1, 1.52])
  const opacity = useTransform(
    progress,
    [start, start + 0.05, mid, end - 0.05, end],
    [0, 0.56, item.special ? 1 : 0.9, 0.5, 0],
  )
  const blurPx  = useTransform(progress, [start, mid, end], [12, 0, 13])
  const rotate  = useTransform(progress, [start, mid, end], [-7, 0, 7])

  // useMotionTemplate is required for string CSS values like filter —
  // useTransform(v, fn) returns a typed MotionValue<string> that Framer
  // can't map to a CSS property. useMotionTemplate produces the correct type.
  const filter  = useMotionTemplate`blur(${blurPx}px)`

  return (
    <motion.div
      className={`spatial-zoom-item${item.special ? ' spatial-zoom-item--special' : ''}${item.accent ? ' spatial-zoom-item--accent' : ''}`}
      style={{
        gridArea: item.area,
        ...(prefersReducedMotion
          ? {}
          : { x, y, z, scale, rotate, opacity, filter }),
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
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.6,
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
