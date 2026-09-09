import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import { SellingFAQ } from '@/components/SellingFAQ'
import { BreadcrumbJsonLd } from '@/components'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { ContactBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'
import { MarketingGallery } from '@/components/MarketingGallery'
import { ContentTemplate } from '@/components/contentTemplate'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Sell Your Chicago Home | Expert Listing Services',
  description: 'Sell your Chicago home with PorterGoldberg. $550M+ in sales, Sotheby\'s global marketing, expert pricing & staging guidance. Serving Lincoln Park, Lakeview & North Side.',
  path: '/selling/our-process',
})

async function getSellingPageData(): Promise<SellingPageData | null> {
  return client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
}

type SellingPageProps = {
  searchParams: Promise<{ showfaq?: string }>
}

export default async function SellingMarketingPage({ searchParams }: SellingPageProps) {
  const data = await getSellingPageData()
  const params = await searchParams
  const showFAQToUsers = params.showfaq === 'true'

  if (!data) {
    return (
      <main className="pg-page">
        <section className="pg-page-hero">
          <h1>Marketing</h1>
          <p>Content coming soon.</p>
        </section>
      </main>
    )
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: 'https://www.portergoldberg.com' },
          { name: 'Sell Your Home', item: 'https://www.portergoldberg.com/selling' },
          { name: 'Our Process', item: 'https://www.portergoldberg.com/selling/our-process' },
        ]}
      />
      <ContentTemplate title="Selling Your Chicago Home: Our Proven Process" heroData={data}>
        <SellingSectionNav currentSection="our process" />  
      <div className="pg-selling-content">
      {data.marketingIntro && data.marketingIntro.length > 0 && (
        <PortableTextClient value={data.marketingIntro} />
      )}

      {data.marketingImage && (
        <div className="pg-selling-column-image" style={{ position: 'relative', aspectRatio: '16/9' }}>
          <Image
            src={data.marketingImage.asset.url}
            alt={data.marketingImage.alt || 'Marketing'}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
      )}
      </div>  

      {data.marketingTypes && data.marketingTypes.length > 0 && (
        <ul className="pg-selling-marketing-list">
          {data.marketingTypes.map((type, index) => (
            <li key={index}>{type}</li>
          ))}
        </ul>
      )}

      <MarketingGallery />

      <SellingFAQ visibleToUsers={showFAQToUsers} />

      <ContactBanner
        title="Connect with us today to build your customized marketing plan."
        cta="Connect"
        openContactForm
        contactMessage="Yes! I would like to get more information about your listing services and discuss a marketing plan."
      />
      </ContentTemplate>
    </>
  )
}
