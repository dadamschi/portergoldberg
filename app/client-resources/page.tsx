import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/client'
import { SCHOOL_GUIDANCE_PAGE_QUERY } from '@/lib/queries'
import { portableTextComponents } from '@/lib/portableText'
import type { SchoolGuidancePageData } from '@/types'

export const metadata: Metadata = {
  title: 'Client Resources',
  description: 'Trusted vendors and local school guidance for Porter Goldberg Residential clients.',
}

async function getSchoolGuidanceData(): Promise<SchoolGuidancePageData | null> {
  const data = await client.fetch<SchoolGuidancePageData>(SCHOOL_GUIDANCE_PAGE_QUERY)
  return data
}

export default async function ClientResourcesPage() {
  const schoolData = await getSchoolGuidanceData()

  return (
    <main className="pg-client-resources-page">
      <section className="pg-resources-header">
        <h1>Client Resources</h1>
        <p>Tools and guidance to help you navigate your real estate journey.</p>
      </section>

      <section className="pg-resources-grid">
        {/* Vendors Teaser */}
        <article className="pg-resource-card">
          <div className="pg-resource-card-image pg-resource-card-image--vendors">
            <span className="pg-resource-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
          </div>
          <div className="pg-resource-card-content">
            <h2>Our Trusted Vendors</h2>
            <p>
              Think of us! …certainly when buying or selling, but also when you need a plumber
              for your investment property, a tried and true grey color for your nursery, a contractor
              for a new addition, or a landscape architect for your forever home. Shoot us an email
              to access our vendor list. We are constantly updating this list, so please send us your feedback.
            </p>
            <Link href="/vendors" className="pg-resource-card-btn">
              Vendor List
            </Link>
          </div>
        </article>

        {/* School Guidance Teaser */}
        <article className="pg-resource-card">
          {schoolData?.image ? (
            <div className="pg-resource-card-image">
              <img
                src={schoolData.image.asset.url}
                alt={schoolData.image.alt || 'School guidance'}
              />
            </div>
          ) : (
            <div className="pg-resource-card-image pg-resource-card-image--schools">
              <span className="pg-resource-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
            </div>
          )}
          <div className="pg-resource-card-content">
            <h2>{schoolData?.headline || 'Local School Guidance'}</h2>
            {schoolData?.content && (
              <div className="pg-resource-card-body">
                <PortableText value={schoolData.content} components={portableTextComponents} />
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}
