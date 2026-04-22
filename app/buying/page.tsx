import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { BUY_PAGE_QUERY } from '@/lib/queries'
import { Flipbook } from '@/components/Flipbook'
import type { BuyPageData } from '@/types'

export const metadata: Metadata = {
  title: 'Buying',
  description: 'Your guide to buying a home in Chicago with Porter Goldberg Residential.',
}

async function getBuyPageData(): Promise<BuyPageData | null> {
  const data = await client.fetch<BuyPageData>(BUY_PAGE_QUERY)
  return data
}

export default async function BuyPage() {
  const data = await getBuyPageData()

  if (!data) {
    return (
      <main className="pg-buy-page">
        <section className="pg-buy-hero">
          <h1>Buying</h1>
          <p>Content coming soon. Please add a Buy Page document in Sanity.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="pg-buy-page">
      <section className="pg-buy-hero">
        <h1>{data.title}</h1>
        {data.headline && <p className="pg-buy-headline">{data.headline}</p>}
      </section>

      <section className="pg-buy-flipbook">
        <Flipbook images={data.flipbookImages} />
      </section>
    </main>
  )
}
