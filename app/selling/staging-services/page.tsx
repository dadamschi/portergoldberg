import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import { addUtmParams } from '@/lib/utils/utm'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { ContactBanner } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'

export const metadata: Metadata = {
  title: 'Staging | Selling',
  description: 'Professional staging services to transform your property and attract buyers.',
}

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
  )
}
