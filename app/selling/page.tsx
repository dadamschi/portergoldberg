import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { portableTextComponents } from '@/lib/portableText'
import { addUtmParams } from '@/lib/utils/utm'
import type { SellingPageData } from '@/types'
import Image from 'next/image'
import { BeforeAfterGallery } from '@/components'
import { NewsletterBanner } from '@/components'

export const metadata: Metadata = {
  title: 'Selling',
  description: 'Our comprehensive selling services including marketing, property preparation, and staging.',
}

async function getSellingPageData(): Promise<SellingPageData | null> {
  const data = await client.fetch<SellingPageData>(SELLING_PAGE_QUERY)
  return data
}

export default async function SellingPage() {
  const data = await getSellingPageData()

  if (!data) {
    return (
      <main className="pg-page pg-selling-page">
        <section className="pg-page-hero">
          <h1>Selling</h1>
          <p>Content coming soon. Please add a Selling Page document in Sanity.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="pg-page pg-selling-page">
      {/* Hero Section */}
      <section className="pg-page-hero">
        <h1>{data.title}</h1>
        {data.heroHeadline && <p>{data.heroHeadline}</p>}
        {data.heroIntro && <p>{data.heroIntro}</p>}
      </section>

      {/* Three Vertical Sections */}
      <div className="pg-selling-columns">
        {/* Marketing Section */}
        <section className="pg-selling-column pg-selling-marketing">
          {data.marketingHeadline && <h2>{data.marketingHeadline}</h2>}
          {data.marketingIntro && data.marketingIntro.length > 0 && (
            <div className="pg-selling-column-intro">
              <PortableText value={data.marketingIntro} components={portableTextComponents} />
            </div>
          )}

          {data.marketingImage && (
            <div className="pg-selling-column-image" style={{ position: 'relative', aspectRatio: '16/9' }}>
              <Image
                src={data.marketingImage.asset.url}
                alt={data.marketingImage.alt || 'Marketing'}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
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

        <div className="pg-listings-cta-section">
          <NewsletterBanner
            title="Find out how Lauren and Samantha can help you get the highest value for your property."
            cta="Reach Out"
            openContactForm
            contactMessage="Yes! I would like to get more information about your listing services."
          />
        </div>

        {/* Property Preparation Section */}
        <section className="pg-selling-column pg-selling-property-prep">
          {data.propertyPrepHeadline && <h2>{data.propertyPrepHeadline}</h2>}
          {data.propertyPrepIntro && data.propertyPrepIntro.length > 0 && (
            <div className="pg-selling-column-intro">
              <PortableText value={data.propertyPrepIntro} components={portableTextComponents} />
            </div>
          )}

          {data.beforeAfterGallery && data.beforeAfterGallery.length > 0 && (
            <BeforeAfterGallery items={data.beforeAfterGallery} />
          )}
        </section>

        {/* Staging Section */}
        <section className="pg-selling-column pg-selling-staging">
          {data.stagingHeadline && <h2>{data.stagingHeadline}</h2>}
          {data.stagingIntro && data.stagingIntro.length > 0 && (
            <>
            <div className="pg-selling-column-intro">
              <PortableText value={data.stagingIntro} components={portableTextComponents} />
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
      </div>
    </main>
  )
}
