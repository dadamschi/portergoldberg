import type { Listing } from '@/types'
import { ListingCard } from '../ListingCard'

export function Listings({listings}: {
  listings: Listing[]
}) {
  const displayed = listings.slice(0, 4)

  return (
    <section className="pg-listings">
      <div className="pg-listings-inner">
        <div className="pg-section-head" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span className="pg-section-title" style={{ marginBottom: 0, fontSize: '46px', fontWeight: 600, color: '#000'   }}>
            Featured Listings
          </span>
          <a href='/inventory' className="pg-section-head-link">
            View All →
          </a>
        </div>

        <div className="pg-listings-grid">
          {displayed.map((listing) => (
            <div key={listing._id} style={{ width: '300px', maxWidth: '100%' }}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
