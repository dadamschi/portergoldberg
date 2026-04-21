import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/client'
import { SCHOOL_GUIDANCE_PAGE_QUERY } from '@/lib/queries'
import { portableTextComponents } from '@/lib/portableText'
import type { SchoolGuidancePageData } from '@/types'

export const metadata: Metadata = {
  title: 'Local School Guidance',
  description: 'Information about local schools in the San Francisco area.',
}

async function getSchoolGuidanceData(): Promise<SchoolGuidancePageData | null> {
  const data = await client.fetch<SchoolGuidancePageData>(SCHOOL_GUIDANCE_PAGE_QUERY)
  return data
}

export default async function SchoolsPage() {
  const data = await getSchoolGuidanceData()

  if (!data) {
    return (
      <main className="pg-schools-page">
        <div className="pg-schools-content">
          <h1>Local School Guidance</h1>
          <p>Content coming soon. Please add a School Guidance Page document in Sanity.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="pg-schools-page">
      <div className="pg-schools-layout">
        <div className="pg-schools-content">
          {data.headline && <h1 className="pg-schools-headline">{data.headline}</h1>}

          {data.content && data.content.length > 0 && (
            <div className="pg-schools-body">
              <PortableText value={data.content} components={portableTextComponents} />
            </div>
          )}
        </div>

        {data.image && (
          <div className="pg-schools-image">
            <img
              src={data.image.asset.url}
              alt={data.image.alt || 'School guidance'}
            />
          </div>
        )}
      </div>
    </main>
  )
}
