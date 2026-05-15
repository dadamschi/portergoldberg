import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import type { SellingPageData } from '@/types'
import { BeforeAfterGallery, NewsletterBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'

export const metadata: Metadata = {
  title: 'Property Preparation | Selling',
  description: 'Expert property preparation services to maximize your home\'s appeal and value.',
}

async function getSellingPageData(): Promise<SellingPageData | null> {
  return client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
}

export default async function SellingPropertyPrepPage() {
  const data = await getSellingPageData()

  if (!data) {
    return (
      <main className="pg-page pg-selling-page pg-selling-subpage">
        <section className="pg-page-hero">
          <h1>Property Preparation</h1>
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

      <SellingSectionNav currentSection="property preparation" />

      <div className="pg-selling-columns">
        {/* Property Preparation Section */}
        <section className="pg-selling-column pg-selling-property-prep">
          {data.propertyPrepHeadline && <h2>{data.propertyPrepHeadline}</h2>}
          {data.propertyPrepIntro && data.propertyPrepIntro.length > 0 && (
            <div className="pg-selling-column-intro">
              <PortableTextClient value={data.propertyPrepIntro} />
            </div>
          )}

          {data.beforeAfterGallery && data.beforeAfterGallery.length > 0 && (
            <BeforeAfterGallery items={data.beforeAfterGallery} />
          )}
        </section>

        <div className="pg-listings-cta-section--selling">
          <NewsletterBanner
            title="Find out how Lauren and Samantha can help you get the highest value for your property."
            cta="Reach Out"
            openContactForm
            contactMessage="Yes! I would like to get more information about your listing services."
          />
        </div>
      </div>
    </main>
  )
}
