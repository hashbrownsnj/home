import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

// Maps CSS animation-range percentages to [start, mid, end] framer keyframes
function range(startPct, endPct) {
  const s = startPct / 100
  const e = endPct / 100
  const m = (s + e) / 2
  return [s, m, e]
}

const ITEMS = [
  // label, gridArea, animRange, extra classes
  { label: 'React',        area: '1/1',           r: range(40, 50) },
  { label: 'Linux',        area: '1/2',           r: range(20, 30) },
  { label: 'OSINT',        area: '1/3',           r: range(52, 62) },
  { label: 'Node',         area: '1/4',           r: range(50, 60) },
  { label: 'Hardening',    area: '2/1',           r: range(45, 55) },
  { label: 'CyberPatriot', area: '2/2',           r: range(21, 31) },
  // special 2×2 "HASH" — handled separately below
  { label: 'Threat Intel', area: '2/4',           r: range(34, 44) },
  { label: 'APIs',         area: '3/1',           r: range(42, 52) },
  // accent "BROWNS" — outline text
  { label: 'BROWNS',       area: '3/4',           r: range(45, 55), accent: true },
  { label: 'Scaling',      area: '4/1',           r: range(58, 68) },
  { label: 'Product',      area: '4/2',           r: range(62, 72) },
  { label: 'Brand',        area: '4/3',           r: range(66, 76) },
  { label: 'DevOps',       area: '4/4',           r: range(70, 80) },
]

const SPECIAL = { label: 'HASH', r: range(-10, 50) }

function GridItem({ label, area, r, accent, special, scrollYProgress }) {
  const [s, m, e] = r

  const z       = useTransform(scrollYProgress, [s, m, e], [-1000, 0, 1000])
  const opacity = useTransform(scrollYProgress, [s, m, e], [0, 1, 0])
  const blur    = useTransform(scrollYProgress, [s, m, e], [8, 0, 8])
  const filter  = useTransform(blur, v => `blur(${v}px)`)

  const gridStyle = special
    ? { gridRow: '2 / span 2', gridColumn: '2 / span 2' }
    : { gridArea: area }

  return (
    <motion.div
      className={[
        'spz-item',
        special ? 'spz-item--special' : '',
        accent  ? 'spz-item--accent'  : '',
      ].filter(Boolean).join(' ')}
      style={{ ...gridStyle, z, opacity, filter }}
    >
      {label}
    </motion.div>
  )
}

export default function SpatialZoom() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const scrollYProgress = useSpring(rawProgress, { stiffness: 80, damping: 20 })

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="spz-outer">
        <div className="spz-sticky">
          <div className="spz-grid" style={{ perspective: '1000px' }}>
            {ITEMS.map(item => (
              <div
                key={item.label}
                className={[
                  'spz-item',
                  item.accent ? 'spz-item--accent' : '',
                ].filter(Boolean).join(' ')}
                style={{ gridArea: item.area, opacity: 0.6 }}
              >
                {item.label}
              </div>
            ))}
            <div
              className="spz-item spz-item--special"
              style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2', opacity: 0.6 }}
            >
              HASH
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="spz-outer">
      {/*
        sticky inner — position:sticky + perspective + preserve-3d.
        NO overflow / isolation / will-change / filter here.
      */}
      <div className="spz-sticky">
        <div className="spz-grid">
          {ITEMS.map(item => (
            <GridItem
              key={item.label}
              scrollYProgress={scrollYProgress}
              {...item}
            />
          ))}
          <GridItem
            key="HASH"
            label={SPECIAL.label}
            area={null}
            r={SPECIAL.r}
            special
            scrollYProgress={scrollYProgress}
          />
        </div>
      </div>
    </section>
  )
}
