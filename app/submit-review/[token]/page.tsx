import type { Metadata } from 'next'
import type { PortableTextBlock } from '@portabletext/types'
import { notFound } from 'next/navigation'
import { verifyReviewToken } from '@/lib/tokens'
import { getContactById, getContactDeals } from '@/lib/hubspot'
import { client } from '@/lib/client'
import { TESTIMONIAL_BY_HUBSPOT_ID_QUERY } from '@/lib/queries'
import { TestimonialForm } from '@/components/TestimonialForm'
import { ExistingTestimonial } from '@/components/ExistingTestimonial'

export const metadata: Metadata = {
  title: 'Share Your Experience',
  description: 'Share your experience working with PorterGoldberg Residential.',
  robots: 'noindex, nofollow',
}

type Props = {
  params: Promise<{ token: string }>
}

type ExistingTestimonialData = {
  _id: string
  clientName: string
  clientTitle?: string
  date?: string
  quote: PortableTextBlock[]
}

// Extract plain text from Portable Text blocks
function portableTextToPlain(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children
        .map((child) => ('text' in child ? child.text : ''))
        .join('')
    })
    .join('\n\n')
}

export default async function SubmitReviewPage({ params }: Props) {
  const { token } = await params

  // Verify token and extract contact ID
  const contactId = verifyReviewToken(token)
  if (!contactId) {
    notFound()
  }

  // Check if testimonial already exists for this contact (including drafts)
  // Using 'raw' perspective to get actual document IDs (with drafts. prefix if draft)
  const existingTestimonial = await client.fetch<ExistingTestimonialData | null>(
    TESTIMONIAL_BY_HUBSPOT_ID_QUERY,
    { hubspotContactId: contactId },
    { perspective: 'raw' }
  )

  // Check if it's a draft (ID starts with "drafts.")
  const isDraft = existingTestimonial?._id.startsWith('drafts.')

  // Published testimonial - show read-only view
  if (existingTestimonial && !isDraft) {
    return (
      <main className="pg-page pg-submit-review-page">
        <section className="pg-page-hero">
          <h1>Thank You!</h1>
          <p>Your testimonial has been published</p>
        </section>

        <section className="pg-submit-review-section">
          <div className="pg-submit-review-inner">
            <ExistingTestimonial testimonial={existingTestimonial} />
          </div>
        </section>
      </main>
    )
  }

  // Fetch contact details and deals from HubSpot
  const [contact, deals] = await Promise.all([
    getContactById(contactId),
    getContactDeals(contactId),
  ])

  const defaultName = existingTestimonial?.clientName
    || (contact ? `${contact.firstname} ${contact.lastname}`.trim() : '')

  // Get most recent deal
  const recentDeal = deals[0] || null

  // Optional Google review URL from env
  const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL

  // Draft exists - allow editing
  const existingData = existingTestimonial
    ? {
        testimonialId: existingTestimonial._id,
        clientName: existingTestimonial.clientName,
        clientTitle: existingTestimonial.clientTitle || '',
        quote: portableTextToPlain(existingTestimonial.quote),
      }
    : undefined

  return (
    <main className="pg-page pg-submit-review-page">
      <section className="pg-page-hero">
        <h1>{existingTestimonial ? 'Edit Your Testimonial' : 'Share Your Experience'}</h1>
        <p>
          {existingTestimonial
            ? 'Your testimonial is pending review. You can make changes below.'
            : "We'd love to hear about your experience working with us"}
        </p>
      </section>

      <section className="pg-submit-review-section">
        <div className="pg-submit-review-inner">
          <TestimonialForm
            token={token}
            defaultName={defaultName}
            googleReviewUrl={googleReviewUrl}
            existingData={existingData}
            dealName={recentDeal?.dealname}
          />
        </div>
      </section>
    </main>
  )
}
