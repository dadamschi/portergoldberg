import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import type { SellingPageData } from '@/types'
import { BeforeAfterGallery, ContactBanner, ContentTemplate } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Property Preparation | Selling Your Chicago Home',
  description: 'PorterGoldberg\'s property preparation services help Chicago homeowners maximize their sale price through strategic improvements, repairs, and pre-listing preparation.',
  path: '/selling/our-process',
})

async function getSellingPageData(): Promise<SellingPageData | null> {
  return client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
}

export default async function SellingPropertyPrepPage() {
  const data = await getSellingPageData()

  if (!data) {
    return (
      <main className="pg-page">
        <section className="pg-page-hero">
          <h1>Property Preparation</h1>
          <p>Content coming soon.</p>
        </section>
      </main>
    )
  }

  return (
    <ContentTemplate title="Property Preparation" heroData={data}>
    <SellingSectionNav currentSection="property preparation" />
      <div className="pg-selling-content">
      {data.propertyPrepIntro && data.propertyPrepIntro.length > 0 && (
        <PortableTextClient value={data.propertyPrepIntro} />
      )}

      {data.beforeAfterGallery && data.beforeAfterGallery.length > 0 && (
        <BeforeAfterGallery items={data.beforeAfterGallery} />
      )}
      </div>
    <ContactBanner
      title="Find out how Lauren and Samantha can help you get the highest value for your property."
      cta="Reach Out"
      openContactForm
      contactMessage="Yes! I would like to get more information about your listing services."
    />

    </ContentTemplate>
  )
}
