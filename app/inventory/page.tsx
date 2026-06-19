import { ContactBanner } from '@/components'
import { ListingsGrid } from '@/components/ListingsGrid'
import { client } from '@/lib/client'
import { ALL_LISTINGS_QUERY } from '@/lib/queries'
import { addUtmParams } from '@/lib/utils/utm'
import { Listing } from "@/types"

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

  return (
    <main className="pg-page pg-inventory-page">
      <section className="pg-page-hero">
        <h1>Properties</h1>
        <p>Explore our current listings and recently sold properties in Chicago</p>
      </section>

      <section className="pg-listings">
        <div className="pg-listings-inner">
          <h2>Available</h2>
          <ListingsGrid listings={available} maxItems={4} />
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
            See more sold properties →
          </a>
          <ListingsGrid listings={sold} maxItems={9} />
        </div>
      </section>
    </main>
  )
}
