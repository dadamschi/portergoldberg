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
function portableTextToPlain(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return ''
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

  // Verify token and extract contact IDs
  const contactIds = verifyReviewToken(token)
  if (!contactIds || contactIds.length === 0) {
    notFound()
  }

  // Use first contact ID for lookup (primary contact)
  const primaryContactId = contactIds[0]

  // Check if testimonial already exists for this contact (including drafts)
  // Using 'raw' perspective to get actual document IDs (with drafts. prefix if draft)
  const existingTestimonial = await client.fetch<ExistingTestimonialData | null>(
    TESTIMONIAL_BY_HUBSPOT_ID_QUERY,
    { hubspotContactId: primaryContactId },
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

  // Fetch all contacts and deals from HubSpot
  const [contacts, deals] = await Promise.all([
    Promise.all(contactIds.map(id => getContactById(id))),
    getContactDeals(primaryContactId),
  ])

  // Merge names for multiple contacts (e.g., "John & Jane Smith" or "John Smith & Jane Doe")
  const defaultName = existingTestimonial?.clientName || (() => {
    const validContacts = contacts.filter(Boolean)
    if (validContacts.length === 0) return ''
    if (validContacts.length === 1) {
      const c = validContacts[0]!
      return `${c.firstname} ${c.lastname}`.trim()
    }
    // Multiple contacts - check if they share last name
    const firstNames = validContacts.map(c => c!.firstname)
    const lastNames = validContacts.map(c => c!.lastname)
    const sharedLastName = lastNames.every(ln => ln === lastNames[0])

    if (sharedLastName) {
      return `${firstNames.join(' & ')} ${lastNames[0]}`.trim()
    } else {
      return validContacts.map(c => `${c!.firstname} ${c!.lastname}`).join(' & ')
    }
  })()

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
