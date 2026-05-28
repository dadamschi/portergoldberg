import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import { FAQJsonLd } from '@/components/JsonLd'
import type { SellingPageData } from '@/types'
import { BeforeAfterGallery, ContactBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'

export const metadata: Metadata = {
  title: 'Property Preparation | Selling Your Chicago Home',
  description: 'PorterGoldberg\'s property preparation services help Chicago homeowners maximize their sale price through strategic improvements, repairs, and pre-listing preparation.',
}

const PROPERTY_PREP_FAQS = [
  {
    question: 'What property preparation does PorterGoldberg recommend before selling?',
    answer: 'PorterGoldberg provides a customized pre-listing consultation identifying high-impact improvements. Common recommendations include fresh paint, updated lighting fixtures, landscaping touch-ups, deep cleaning, and addressing deferred maintenance items that could affect buyer perception or inspection results.',
  },
  {
    question: 'Does preparing a home for sale increase the final price?',
    answer: 'Yes. Properly prepared homes typically sell faster and for higher prices. Strategic improvements and repairs remove buyer objections and help your home compete effectively in Chicago\'s market. PorterGoldberg guides you on which investments offer the best return.',
  },
  {
    question: 'How long does property preparation take before listing?',
    answer: 'Preparation timelines vary from 1-4 weeks depending on the scope of work needed. PorterGoldberg coordinates with trusted contractors and vendors to streamline the process and get your home market-ready efficiently.',
  },
]

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
    <>
      <FAQJsonLd faqs={PROPERTY_PREP_FAQS} />
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
            {/* {data.propertyPrepHeadline && <h2>{data.propertyPrepHeadline}</h2>} */}
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
            <ContactBanner
              title="Find out how Lauren and Samantha can help you get the highest value for your property."
              cta="Reach Out"
              openContactForm
              contactMessage="Yes! I would like to get more information about your listing services."
            />
          </div>
        </div>
      </main>
    </>
  )
}
