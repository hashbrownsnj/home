const ITEMS = [
  'React',
  'Linux',
  'OSINT',
  'Node',
  'Hardening',
  'CyberPatriot',
  'Threat Intel',
  'APIs',
  'Scaling',
  'Product',
  'Brand',
  'DevOps',
]

export default function SpatialZoom() {
  return (
    <section className="spz-outer" aria-labelledby="stack-heading">
      <div className="spz-header">
        <p className="section-sub">[ STATIC SIGNAL WALL ]</p>
        <h2 id="stack-heading" className="section-title">Sharp tools, sharper taste.</h2>
      </div>
      <div className="spz-grid">
        <div className="spz-item spz-item--special">HASH</div>
        <div className="spz-item spz-item--accent">BROWNS</div>
        {ITEMS.map(item => (
          <div key={item} className="spz-item">
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}
