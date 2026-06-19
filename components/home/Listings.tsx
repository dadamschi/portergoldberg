import type { Listing } from '@/types'
import { ListingsGrid } from '../ListingsGrid'

type ListingsProps = {
  listings: Listing[]
  isFeatured?: boolean
}

export function Listings({ listings, isFeatured }: ListingsProps) {
  return (
    <section className="pg-listings">
      {isFeatured && (
        <div className="pg-section-head" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span className="pg-section-title" style={{ marginBottom: 0, fontSize: '46px', fontWeight: 600, color: '#000' }}>
            Featured Listings
          </span>
          <a href='/inventory' className="pg-section-head-link">
            View All →
          </a>
        </div>
      )}
      <ListingsGrid listings={listings} maxItems={4} />
    </section>
  )
}
