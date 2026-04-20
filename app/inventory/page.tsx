import { client } from '@/lib/client'
import { ALL_LISTINGS_QUERY } from '@/lib/queries'
import { Listing } from "@/types"
import { ListingCard } from '@/components/ListingCard'

type InventoryData = {
  available: Listing[],
  sold: Listing[]
}

const STATUS_CLASS: Record<string, string> = {
  active: 'pg-listing-status--active',
  coming: 'pg-listing-status--coming',
  sold: 'pg-listing-status--sold',
}

async function getInventoryData(): Promise<InventoryData> {
  try {
    const data = await client.fetch<InventoryData>(ALL_LISTINGS_QUERY)
    return data
  } catch (error) {
    console.error('Failed to fetch from Sanity:', error)
    return { available: [], sold: [] }
  }
}

export default async function InventoryPage() {
  const { available, sold } = await getInventoryData();
  const availableDisplayed = available.slice(0, 4);
  const availableColumnCount = Math.min(availableDisplayed.length, 4);
  const soldDisplayed = sold.slice(0, 4);
  const soldColumnCount = Math.min(soldDisplayed.length, 4);

  return (
    <section className="pg-listings">
      <div className="pg-listings-inner">
        <h2>Available</h2>
        <div
            className="pg-listings-grid"
            style={{ gridTemplateColumns: `repeat(${availableColumnCount}, 1fr)` }}
          >
            {availableDisplayed.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
      </div>
      <div className="pg-listings-inner">
        <h2>Sold</h2>
        <div
            className="pg-listings-grid"
            style={{ gridTemplateColumns: `repeat(${soldColumnCount}, 1fr)` }}
          >
            {soldDisplayed.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
      </div>
    </section>
  )
}
