type Tile = {
  href: string
  label: string
  name: string
  bg: string
  tall?: boolean
}

type AboutProps = {
  sectionLabel: string
  headline: string
  paragraphs: string[]
  tagline: string
  tiles?: Tile[]
}

const DEFAULT_TILES: Tile[] = [
  {
    href: '/our-process',
    label: 'Selling',
    name: 'Our Process',
    bg: '#2C3E35',
    tall: true,
  },
  {
    href: '/buying',
    label: 'Buying',
    name: 'Find Your Home',
    bg: '#3A3228',
    tall: false,
  },
  {
    href: '/about-us',
    label: 'About',
    name: 'Meet the Team',
    bg: '#28303C',
    tall: false,
  },
]

export function About({
  sectionLabel,
  headline,
  paragraphs,
  tagline,
  tiles = DEFAULT_TILES,
}: AboutProps) {
  return (
    <section className="pg-about">
      {/* Text column */}
      <div>
        <p className="pg-section-label">{sectionLabel}</p>
        <h2 className="pg-section-title">
          {headline.split(',').map((part, i) => (
            <span key={i}>
              {part.trim()}
              {i === 0 && <br />}
            </span>
          ))}
        </h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="pg-about-body">
            {p}
          </p>
        ))}
        <p className="pg-about-fine">{tagline}</p>
      </div>

      {/* Tile grid */}
      <div className="pg-tiles">
        {tiles.map((tile) => (
          <a
            key={tile.href}
            href={tile.href}
            className={`pg-tile${tile.tall ? ' pg-tile--tall' : ''}`}
            style={{ backgroundColor: tile.bg }}
          >
            <span className="pg-tile-sub">{tile.label}</span>
            <span className="pg-tile-name">{tile.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
