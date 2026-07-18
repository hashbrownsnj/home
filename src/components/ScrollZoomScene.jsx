// Dark atmospheric SVG as an inline data URI — no external dependency
const ATMOSPHERE_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" width="1400" height="900">
  <defs>
    <radialGradient id="g1" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#0d1f3c"/>
      <stop offset="40%" stop-color="#060d1a"/>
      <stop offset="100%" stop-color="#020508"/>
    </radialGradient>
    <radialGradient id="g2" cx="30%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#1a3a6b" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#020508" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g3" cx="72%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#0a1f4d" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#020508" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="60"/></filter>
  </defs>
  <rect width="1400" height="900" fill="url(#g1)"/>
  <ellipse cx="420" cy="540" rx="480" ry="320" fill="url(#g2)" filter="url(#blur1)"/>
  <ellipse cx="1008" cy="270" rx="380" ry="260" fill="url(#g3)" filter="url(#blur1)"/>
  <rect x="0" y="720" width="1400" height="180" fill="#02050a"/>
  <g fill="#040810">
    <rect x="80" y="690" width="18" height="30"/><rect x="110" y="670" width="14" height="50"/><rect x="140" y="680" width="22" height="40"/><rect x="180" y="660" width="16" height="60"/><rect x="220" y="700" width="12" height="20"/><rect x="250" y="650" width="20" height="70"/><rect x="290" y="670" width="14" height="50"/><rect x="320" y="640" width="24" height="80"/><rect x="360" y="660" width="16" height="60"/><rect x="400" y="680" width="18" height="40"/><rect x="440" y="645" width="28" height="75"/><rect x="490" y="665" width="14" height="55"/><rect x="520" y="620" width="32" height="100"/><rect x="570" y="655" width="18" height="65"/><rect x="610" y="670" width="20" height="50"/><rect x="650" y="630" width="26" height="90"/><rect x="700" y="650" width="16" height="70"/><rect x="740" y="610" width="36" height="110"/><rect x="800" y="640" width="22" height="80"/><rect x="840" y="660" width="14" height="60"/><rect x="870" y="625" width="28" height="95"/><rect x="920" y="645" width="18" height="75"/><rect x="960" y="670" width="20" height="50"/><rect x="1000" y="635" width="24" height="85"/><rect x="1050" y="655" width="16" height="65"/><rect x="1090" y="640" width="30" height="80"/><rect x="1140" y="660" width="14" height="60"/><rect x="1170" y="630" width="22" height="90"/><rect x="1220" y="650" width="18" height="70"/><rect x="1260" y="670" width="24" height="50"/><rect x="1310" y="640" width="20" height="80"/><rect x="1350" y="655" width="16" height="65"/>
  </g>
  <g fill="#e8edf5" opacity="0.4">
    <circle cx="120" cy="80" r="1"/><circle cx="340" cy="50" r="1.2"/><circle cx="560" cy="120" r="0.8"/><circle cx="780" cy="40" r="1"/><circle cx="960" cy="95" r="1.4"/><circle cx="1150" cy="60" r="0.9"/><circle cx="1320" cy="140" r="1.1"/><circle cx="200" cy="200" r="0.8"/><circle cx="480" cy="160" r="1.2"/><circle cx="700" cy="220" r="0.7"/><circle cx="900" cy="180" r="1"/><circle cx="1100" cy="240" r="0.9"/><circle cx="60" cy="300" r="0.8"/><circle cx="260" cy="280" r="1"/><circle cx="640" cy="300" r="1.3"/><circle cx="1240" cy="320" r="0.8"/>
  </g>
</svg>`)}`

export default function ScrollZoomScene() {
  return (
    <section className="szs-outer" aria-labelledby="build-heading">
      <div className="szs-panel">
        <img src={ATMOSPHERE_SVG} alt="" className="szs-img" aria-hidden="true" />
        <div className="szs-overlay" aria-hidden="true" />
        <div className="szs-text">
          <span className="szs-kicker">No gimmicks. Just craft.</span>
          <h2 id="build-heading" className="szs-heading">Build Things That Matter</h2>
          <p className="szs-sub">Full-stack · Security · Design</p>
        </div>
      </div>
    </section>
  )
}
