import { ContactBanner } from '@/components'
import { client } from '@/lib/client'
import { ALL_LISTINGS_QUERY } from '@/lib/queries'
import { addUtmParams } from '@/lib/utils/utm'
import { Listing } from "@/types"
import { ListingCard } from '@/components/ListingCard'

type InventoryData = {
  available: Listing[],
  sold: Listing[]
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
  const { available, sold } = await getInventoryData()
  const availableDisplayed = available.slice(0, 4);
  const availableColumnCount = Math.min(availableDisplayed.length, 4);
  const soldDisplayed = sold.slice(0, 4);
  const soldColumnCount = Math.min(soldDisplayed.length, 4);

  return (
    <main className="pg-page pg-inventory-page">
      <section className="pg-page-hero">
        <h1>Properties</h1>
        <p>Explore our current listings and recently sold properties in Chicago.</p>
      </section>

      <section className="pg-listings">
        <div className="pg-listings-inner">
          <h2>Available & Coming Soon</h2>
        <div
            className="pg-listings-grid"
            style={{ gridTemplateColumns: `repeat(${availableColumnCount}, 1fr)` }}
          >
            {availableDisplayed.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
      </div>

      <div className="pg-listings-cta-section">
        <ContactBanner
          title="Have questions about our available or upcoming listings?"
          cta="Reach Out"
          openContactForm
          contactMessage="I have questions about your available or upcoming listings."
        />
      </div>

      <div className="pg-listings-inner">
        <h2>Sold</h2>
        <a
          href={addUtmParams("https://www.sothebysrealty.com/jamesonsir/eng/sold/int/775-a-df19010717111012533-agentid", { campaign: 'sold-listings' })}
          target="_blank"
          rel="noopener noreferrer"
          className="pg-listings-more-link"
        >
          See more closed properties →
        </a>
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
    </main>
  )
}
