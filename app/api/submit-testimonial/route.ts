import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/client'
import { verifyReviewToken } from '@/lib/tokens'
import { nanoid } from 'nanoid'
import { textToPortableText } from '@/lib/utils/text'
import { sendEmail } from '@/lib/email'

type SubmitTestimonialRequest = {
  token: string
  clientName: string
  clientTitle?: string
  quote: string
  testimonialId?: string // For updating existing drafts
  date?: string // Client-provided date (YYYY-MM-DD)
  dealName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitTestimonialRequest = await request.json()
    const { token, clientName, clientTitle, quote, testimonialId: existingId, date, dealName } = body

    // Validate required fields
    if (!token || !clientName || !quote) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify token
    const contactIds = verifyReviewToken(token)
    if (!contactIds || contactIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const primaryContactId = contactIds[0]

    // Check if write client is configured
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      throw new Error('SANITY_API_WRITE_TOKEN not configured')
    }

    // Use existing ID (for updates) or create new one
    const testimonialId = existingId || `drafts.testimonial-${nanoid()}`

    const document = {
      _id: testimonialId,
      _type: 'testimonial',
      clientName: clientName.trim(),
      clientTitle: clientTitle?.trim() || undefined,
      date: date || new Date().toISOString().split('T')[0],
      quote: textToPortableText(quote.trim()),
      pinOnHomePage: false,
      hubspotContactId: primaryContactId,
      hubspotContactIds: contactIds, // Store all contact IDs
    }

    const draftedTestimonial = await writeClient.createOrReplace(document)

    // Build Sanity Studio URL for the draft
    const sanityStudioUrl = `https://portergoldberg.sanity.studio/desk/testimonial;${testimonialId}`

    // Send notification email
    if(draftedTestimonial){
      const emailResult = await sendEmail({
        subject: `New Testimonial submitted by: ${clientName}${dealName ? ` (${dealName})` : ''}`,
        html: `
          <h2>New Testimonial Submission</h2>
          <hr>
          <p><strong>Name:</strong> ${clientName}</p>
          ${clientTitle ? `<p><strong>Title:</strong> ${clientTitle}</p>` : ''}
          ${dealName ? `<p><strong>Deal:</strong> ${dealName}</p>` : ''}
          <p><strong>Date:</strong> ${date || new Date().toISOString().split('T')[0]}</p>
          <p><strong>Testimonial:</strong></p>
          <p>${quote.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><strong>HubSpot Contact ID:</strong> ${primaryContactId}</p>
          <p><strong>Sanity Document ID:</strong> ${testimonialId}</p>
          <p><a href="${sanityStudioUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2276FC; color: white; text-decoration: none; border-radius: 4px; margin-top: 10px;">Open in Sanity Studio to Publish</a></p>
          <p><em>This testimonial has been created as a draft in Sanity. Click the button above to review and publish.</em></p>
        `,
      })

      if (emailResult.error) {
        console.error('Failed to send testimonial notification email:', emailResult.error)
        // Don't fail the request if email fails - testimonial was already saved
      }
    }

    return NextResponse.json({
      success: true,
      testimonialId,
      isUpdate: !!existingId,
    })
  } catch (error) {
    console.error('Failed to submit testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}
