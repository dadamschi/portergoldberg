import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { PortableTextClient } from '@/components/PortableTextClient'
import { addUtmParams } from '@/lib/utils/utm'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { ContactBanner, ContentTemplate } from '@/components'
import { SellingSectionNav } from '@/components/SellingSectionNav'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
    title: 'Staging Services | Selling Your Chicago Home',
    description: 'Professional home staging services from PorterGoldberg help Chicago sellers present their properties beautifully and sell faster for top dollar.',
    path: '/selling/our-process',
  })

async function getSellingPageData(): Promise<SellingPageData | null> {
  return client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
}

export default async function SellingStagingPage() {
  const data = await getSellingPageData()

  if (!data) {
    return (
      <main className="pg-page">
        <section className="pg-page-hero">
          <h1>Staging</h1>
          <p>Content coming soon.</p>
        </section>
      </main>
    )
  }

  return (
    <ContentTemplate title="Staging Services" heroData={data}>
      <SellingSectionNav currentSection="staging services" />      
      {data.stagingIntro && data.stagingIntro.length > 0 && (
        <div className="pg-selling-content">
          <PortableTextClient value={data.stagingIntro} />
          <div style={{ marginTop: '2rem' }}>
            <a
              href={addUtmParams('https://www.havenhomestager.com/', { campaign: 'staging-partner' })}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-selling-staging-btn"
            >
              Haven Home Stagers
            </a>
          </div>
        </div>
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

      <ContactBanner
        title="We can help you get your property ready with a staging consultation."
        cta="Stage my property"
        openContactForm
        contactMessage="Yes! I would like to get more information about your property staging services."
      />
    </ContentTemplate>
  )
}
