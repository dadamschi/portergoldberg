import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/client'
import { SCHOOL_GUIDANCE_PAGE_QUERY } from '@/lib/queries'
import { portableTextComponents } from '@/lib/portableText'
import type { SchoolGuidancePageData } from '@/types'
import { ContentTemplate } from '@/components'

export const metadata: Metadata = {
  title: 'Local School Guidance',
  description: 'Navigate Chicago\'s school landscape with expert guidance from PorterGoldberg Residential.',
}

export const revalidate = 86400

async function getSchoolGuidanceData(): Promise<SchoolGuidancePageData | null> {
  const data = await client.fetch<SchoolGuidancePageData>(SCHOOL_GUIDANCE_PAGE_QUERY)
  return data
}

export default async function SchoolGuidancePage() {
  const data = await getSchoolGuidanceData()
  if (!data) {
    throw new Error('School guidance page data not found')
  }
  const { title, headline, content, image } = data
  const heroData = { 
    heroHeadline: headline 
  }

  return (
    <ContentTemplate
      title={title}
      heroData={heroData}
    >
      <section className="pg-school-guidance-content">
        <div className="pg-school-guidance-inner">
          {image?.asset?.url && (
            <div className="pg-school-guidance-image">
              <Image
                src={image.asset.url}
                alt={image.alt || 'School guidance'}
                width={600}
                height={400}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}
          {content && content.length > 0 && (
            <div className="pg-school-guidance-text">
              <PortableText value={content} components={portableTextComponents} />
            </div>
          )}
        </div>
      </section>
    </ContentTemplate>
  )
}
