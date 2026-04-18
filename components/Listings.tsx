import type { Listing } from '@/types'

const STATUS_CLASS: Record<string, string> = {
  active: 'pg-listing-status--active',
  coming: 'pg-listing-status--coming',
  sold: 'pg-listing-status--sold',
}

function ListingCard({ listing }: { listing: Listing }) {
  const { address, neighborhood, price, status, statusType, image, fallbackColor, brochureUrl } = listing

  const bgStyle = image?.asset?.url
    ? { backgroundImage: `url(${image.asset.url})` }
    : { backgroundColor: fallbackColor ?? '#2C3E35' }

  const Tag = brochureUrl ? 'a' : 'div'

  return (
    <Tag
      href={brochureUrl ?? undefined}
      target={brochureUrl ? '_blank' : undefined}
      rel={brochureUrl ? 'noreferrer' : undefined}
      className="pg-listing-card"
    >
      <div className="pg-listing-bg" style={bgStyle} />
      <span className={`pg-listing-status ${STATUS_CLASS[statusType]}`}>
        {status}
      </span>
      <div className="pg-listing-inner">
        <div className="pg-listing-price">{price}</div>
        <div className="pg-listing-address">{address}</div>
        <div className="pg-listing-address">{neighborhood}</div>
      </div>
    </Tag>
  )
}

type ListingsProps = {
  listings: Listing[]
  title?: string
  viewAllHref?: string
}

export function Listings({
  listings,
  viewAllHref = '/inventory',
}: ListingsProps) {
  const displayed = listings.slice(0, 4)
  const columnCount = Math.min(displayed.length, 4)

  return (
    <section className="pg-listings">
      <div className="pg-listings-inner">
        <div className="pg-section-head" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span className="pg-section-title" style={{ marginBottom: 0, fontSize: '46px', fontWeight: 600 }}>
            Featured Listings
          </span>
          <a href={viewAllHref} className="pg-section-head-link">
            View All →
          </a>
        </div>

        <div
          className="pg-listings-grid"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {displayed.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  )
}
