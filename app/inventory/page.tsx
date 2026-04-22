import { AgentCard } from '@/components'
import { client } from '@/lib/client'
import { ALL_LISTINGS_QUERY, AGENTS_QUERY } from '@/lib/queries'
import { Listing, Agent } from "@/types"
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

async function getAgents(): Promise<Agent[]> {
  try {
    return await client.fetch<Agent[]>(AGENTS_QUERY)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return []
  }
}

export default async function InventoryPage() {
  const [{ available, sold }, agents] = await Promise.all([
    getInventoryData(),
    getAgents(),
  ])
  const availableDisplayed = available.slice(0, 4);
  const availableColumnCount = Math.min(availableDisplayed.length, 4);
  const soldDisplayed = sold.slice(0, 4);
  const soldColumnCount = Math.min(soldDisplayed.length, 4);

  return (
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
        <AgentCard
          agent={agents[0]}
          title="Have questions about our available or upcoming listings?"
          cta="Reach Out"
          openContactForm
        />
      </div>

      <div className="pg-listings-inner">
        <h2>Sold</h2>
        <a
          href="https://www.sothebysrealty.com/jamesonsir/eng/sold/int/775-a-df19010717111012533-agentid"
          target="_blank"
          rel="noopener noreferrer"
          className="pg-listings-more-link"
        >
          See more sold and rented listings →
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
  )
}
