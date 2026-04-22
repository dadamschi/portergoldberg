import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/client'
import { SELLING_PAGE_QUERY } from '@/lib/queries'
import { portableTextComponents } from '@/lib/portableText'
import type { SellingPageData } from '@/types'
import Image from 'next/image'

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
      <main className="pg-selling-page">
        <section className="pg-selling-hero">
          <h1>Selling</h1>
          <p>Content coming soon. Please add a Selling Page document in Sanity.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="pg-selling-page">
      {/* Hero Section */}
      <section className="pg-selling-hero">
        <h1>{data.title}</h1>
        {data.heroHeadline && <h2 className="pg-selling-headline">{data.heroHeadline}</h2>}
        {data.heroIntro && <p className="pg-selling-intro">{data.heroIntro}</p>}
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

        {/* Property Preparation Section */}
        <section className="pg-selling-column pg-selling-property-prep">
          {data.propertyPrepHeadline && <h2>{data.propertyPrepHeadline}</h2>}
          {data.propertyPrepIntro && data.propertyPrepIntro.length > 0 && (
            <div className="pg-selling-column-intro">
              <PortableText value={data.propertyPrepIntro} components={portableTextComponents} />
            </div>
          )}

          {data.beforeAfterGallery && data.beforeAfterGallery.length > 0 && (
            <div className="pg-selling-before-after">
              {data.beforeAfterGallery.map((item, index) => (
                <div key={index} className="pg-selling-before-after-item">
                  {item.name && <h4>{item.name}</h4>}
                  <div className="pg-selling-before-after-images">
                    <div className="pg-selling-before">
                      <span className="pg-selling-label">Before</span>
                      <Image
                        src={item.beforeImage.asset.url}
                        alt={item.beforeImage.alt || `${item.name} before`}
                        width={400}
                        height={215}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="pg-selling-after">
                      <span className="pg-selling-label">After</span>
                      <Image
                        src={item.afterImage.asset.url}
                        alt={item.afterImage.alt || `${item.name} after`}
                        width={400}
                        height={215}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Staging Section */}
        <section className="pg-selling-column pg-selling-staging">
          {data.stagingHeadline && <h2>{data.stagingHeadline}</h2>}
          {data.stagingIntro && data.stagingIntro.length > 0 && (
            <div className="pg-selling-column-intro">
              <PortableText value={data.stagingIntro} components={portableTextComponents} />
            </div>
          )}

          <a
            href="https://www.havenhomestager.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="pg-selling-staging-btn"
          >
            Haven Home Stagers
          </a>

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
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
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
