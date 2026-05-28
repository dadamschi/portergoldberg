import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import { FAQJsonLd } from '@/components/JsonLd'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { ContactBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'
import { MarketingGallery } from '@/components/MarketingGallery'

export const metadata: Metadata = {
  title: 'Marketing | Selling Your Chicago Home',
  description: 'PorterGoldberg\'s comprehensive marketing services include professional photography, videography, custom brochures, and targeted digital campaigns to sell your Chicago home.',
}

const MARKETING_FAQS = [
  {
    question: 'What marketing does PorterGoldberg provide when selling a home?',
    answer: 'PorterGoldberg creates comprehensive marketing packages including professional photography, videography, drone footage, custom brochures, social media campaigns, email marketing, and placement on major real estate platforms like Zillow, Realtor.com, and the MLS.',
  },
  {
    question: 'How does PorterGoldberg market luxury homes in Chicago?',
    answer: 'Through Jameson Sotheby\'s International Realty, PorterGoldberg provides access to the global Sotheby\'s network, premium print advertising, targeted digital campaigns, and exclusive luxury real estate platforms that reach qualified high-net-worth buyers.',
  },
  {
    question: 'Does PorterGoldberg use professional photography for listings?',
    answer: 'Yes. Every PorterGoldberg listing receives professional photography, including HDR interior shots, twilight exteriors, and drone aerial photography when appropriate. High-quality visuals are essential for attracting buyers in Chicago\'s competitive market.',
  },
]

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
    <>
    <FAQJsonLd faqs={MARKETING_FAQS} />
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

          <MarketingGallery />
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
    </>
  )
}
