import type { Listing } from '@/types'
import { ListingCard } from '../ListingCard'

export function Listings({listings}: {
  listings: Listing[]
}) {
  const displayed = listings.slice(0, 4)
  const columnCount = Math.min(displayed.length, 4)

  return (
    <section className="pg-listings">
      <div className="pg-listings-inner">
        <div className="pg-section-head" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span className="pg-section-title" style={{ marginBottom: 0, fontSize: '46px', fontWeight: 600 }}>
            Featured Listings
          </span>
          <a href='/inventory' className="pg-section-head-link">
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
