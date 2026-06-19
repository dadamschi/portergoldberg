import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'

type ListingsGridProps = {
  listings: Listing[]
  maxItems?: number
}

function getGridClass(count: number) {
  if (count % 4 === 0) {
    return 'pg-listings-grid pg-listings-grid--4col'
  }
  return 'pg-listings-grid pg-listings-grid--3col'
}

export function ListingsGrid({ listings, maxItems }: ListingsGridProps) {
  const displayed = maxItems ? listings.slice(0, maxItems) : listings

  return (
    <div className={getGridClass(displayed.length)}>
      {displayed.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  )
}
