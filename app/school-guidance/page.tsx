import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/client'
import { SCHOOL_GUIDANCE_PAGE_QUERY } from '@/lib/queries'
import { portableTextComponents } from '@/lib/portableText'
import type { SchoolGuidancePageData } from '@/types'

export const metadata: Metadata = {
  title: 'Local School Guidance',
  description: 'Navigate Chicago\'s school landscape with expert guidance from Porter Goldberg Residential.',
}

export const revalidate = 86400

async function getSchoolGuidanceData(): Promise<SchoolGuidancePageData | null> {
  const data = await client.fetch<SchoolGuidancePageData>(SCHOOL_GUIDANCE_PAGE_QUERY)
  return data
}

export default async function SchoolGuidancePage() {
  const data = await getSchoolGuidanceData()

  if (!data) {
    return (
      <main className="pg-page pg-school-guidance-page">
        <section className="pg-page-hero">
          <h1>Local School Guidance</h1>
          <p>Content coming soon. Please add a School Guidance Page document in Sanity.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="pg-page pg-school-guidance-page">
      <section className="pg-page-hero">
        <h1>{data.title}</h1>
        {data.headline && <p>{data.headline}</p>}
      </section>

      <section className="pg-school-guidance-content">
        <div className="pg-school-guidance-inner">
          {data.image?.asset?.url && (
            <div className="pg-school-guidance-image">
              <Image
                src={data.image.asset.url}
                alt={data.image.alt || 'School guidance'}
                width={600}
                height={400}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}
          {data.content && data.content.length > 0 && (
            <div className="pg-school-guidance-text">
              <PortableText value={data.content} components={portableTextComponents} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
