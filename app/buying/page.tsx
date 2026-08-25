import { client } from '@/lib/client'
import { BUY_PAGE_QUERY } from '@/lib/queries'
import { Flipbook } from '@/components/Flipbook'
import type { BuyPageData } from '@/types'
import { createMetadata } from '@/lib/metadata'
import { ContentTemplate } from '@/components'

export const metadata = createMetadata({
  title: 'Chicago Home Buying Guide | Expert Buyer Agents',
  description: 'Expert guide to buying a home in Chicago. PorterGoldberg Residential provides full-service buyer representation in Lincoln Park, Lakeview, Bucktown, and Chicago\'s North Side.',
  path: '/buying',
})

async function getBuyPageData(): Promise<BuyPageData | null> {
  const data = await client.fetch<BuyPageData>(BUY_PAGE_QUERY)
  return data
}

export default async function BuyPage() {
  const data = await getBuyPageData()
  const templateData = {
    title: data?.title,
    heroHeadline: data?.headline,
  }

  if (!data) {
    return (
      <main className="pg-page">
        <section className="pg-page-hero">
          <h1>Buying</h1>
          <p>Content coming soon. Please add a Buy Page document in Sanity.</p>
        </section>
      </main>
    )
  }

  return (
    <ContentTemplate title={data.title} heroData={templateData}>
      <section className="pg-buy-flipbook">
        <Flipbook images={data.flipbookImages} />
      </section>
    </ContentTemplate>
  )
}
