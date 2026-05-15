import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { ContactBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'

export const metadata: Metadata = {
  title: 'Marketing | Selling',
  description: 'Our comprehensive marketing services to showcase your property and reach qualified buyers.',
}

async function getSellingPageData(): Promise<SellingPageData | null> {
  return client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
}

export default async function SellingMarketingPage() {
  const data = await getSellingPageData()

  if (!data) {
    return (
      <main className="pg-page pg-selling-page pg-selling-subpage">
        <section className="pg-page-hero">
          <h1>Marketing</h1>
          <p>Content coming soon.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="pg-page pg-selling-page pg-selling-subpage">
      {/* Hero Section */}
      <section className="pg-page-hero">
        <h1>{data.title}</h1>
        {data.heroHeadline && <p>{data.heroHeadline}</p>}
        {data.heroIntro && <p>{data.heroIntro}</p>}
      </section>

      <SellingSectionNav currentSection="our process" />

      <div className="pg-selling-columns">
        {/* Marketing Section */}
        <section className="pg-selling-column pg-selling-marketing">
          {/* {data.marketingHeadline && <h2>{data.marketingHeadline}</h2>} */}
          {data.marketingIntro && data.marketingIntro.length > 0 && (
            <div className="pg-selling-column-intro">
              <PortableTextClient value={data.marketingIntro} />
            </div>
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

          {data.marketingTypes && data.marketingTypes.length > 0 && (
            <ul className="pg-selling-marketing-list">
              {data.marketingTypes.map((type, index) => (
                <li key={index}>{type}</li>
              ))}
            </ul>
          )}
        </section>

        <div className="pg-listings-cta-section--selling">
          <ContactBanner
            title="Connect with us today to build your customized marketing plan."
            cta="Connect"
            openContactForm
            contactMessage="Yes! I would like to get more information about your listing services and discuss a marketing plan."
          />
        </div>
      </div>
    </main>
  )
}
