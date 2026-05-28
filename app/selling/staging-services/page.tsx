import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import { FAQJsonLd } from '@/components/JsonLd'
import { addUtmParams } from '@/lib/utils/utm'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { ContactBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'

export const metadata: Metadata = {
  title: 'Staging Services | Selling Your Chicago Home',
  description: 'Professional home staging services from PorterGoldberg help Chicago sellers present their properties beautifully and sell faster for top dollar.',
}

const STAGING_FAQS = [
  {
    question: 'Does PorterGoldberg offer home staging services?',
    answer: 'Yes. PorterGoldberg provides staging consultation and coordinates professional staging services through trusted partners like Haven Home Stagers. Staging helps buyers visualize living in the space and typically results in faster sales at higher prices.',
  },
  {
    question: 'How much does home staging cost in Chicago?',
    answer: 'Staging costs vary based on home size and scope, typically ranging from $2,000-$8,000 for a 3-month staging period. PorterGoldberg helps you determine the right level of staging investment based on your property and target buyer demographic.',
  },
  {
    question: 'Is home staging worth it when selling a house?',
    answer: 'Studies show staged homes sell 73% faster and for 5-10% more than non-staged homes. In Chicago\'s competitive market, staging helps your listing stand out in photos and showings, attracting more qualified buyers and stronger offers.',
  },
]

async function getSellingPageData(): Promise<SellingPageData | null> {
  return client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
}

export default async function SellingStagingPage() {
  const data = await getSellingPageData()

  if (!data) {
    return (
      <main className="pg-page pg-selling-page pg-selling-subpage">
        <section className="pg-page-hero">
          <h1>Staging</h1>
          <p>Content coming soon.</p>
        </section>
      </main>
    )
  }

  return (
    <>
      <FAQJsonLd faqs={STAGING_FAQS} />
      <main className="pg-page pg-selling-page pg-selling-subpage">
        {/* Hero Section */}
        <section className="pg-page-hero">
          <h1>{data.title}</h1>
          {data.heroHeadline && <p>{data.heroHeadline}</p>}
          {data.heroIntro && <p>{data.heroIntro}</p>}
        </section>

        <SellingSectionNav currentSection="staging services" />

      <div className="pg-selling-columns">
        {/* Staging Section */}
        <section className="pg-selling-column pg-selling-staging">
          {/* {data.stagingHeadline && <h2>{data.stagingHeadline}</h2>} */}
          {data.stagingIntro && data.stagingIntro.length > 0 && (
            <>
              <div className="pg-selling-column-intro">
                <PortableTextClient value={data.stagingIntro} />
              </div>
              <div>
                <a
                  href={addUtmParams('https://www.havenhomestager.com/', { campaign: 'staging-partner' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pg-selling-staging-btn"
                >
                  Haven Home Stagers
                </a>
              </div>
            </>
          )}

          {data.stagingPartners && data.stagingPartners.length > 0 && (
            <div className="pg-selling-partners">
              {data.stagingPartners.map((partner, index) => (
                <div key={index} className="pg-selling-partner">
                  {partner.logo && (
                    <Image
                      src={partner.logo.asset.url}
                      alt={partner.logo.alt || partner.name}
                      className="pg-selling-partner-logo"
                      width={120}
                      height={60}
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                  <h4>{partner.name}</h4>
                  {partner.description && <p>{partner.description}</p>}
                  {partner.website && (
                    <a href={addUtmParams(partner.website, { campaign: 'staging-partner' })} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="pg-listings-cta-section--selling">
          <ContactBanner
            title="We can help you get your property ready with a staging consultation."
            cta="Stage my property"
            openContactForm
            contactMessage="Yes! I would like to get more information about your property staging services."
          />
        </div>
      </div>
    </main>
    </>
  )
}
