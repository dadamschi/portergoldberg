import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/client'
import { verifyReviewToken } from '@/lib/tokens'
import { nanoid } from 'nanoid'

type SubmitTestimonialRequest = {
  token: string
  clientName: string
  clientTitle?: string
  quote: string
  testimonialId?: string // For updating existing drafts
  date?: string // Client-provided date (YYYY-MM-DD)
}

// Convert plain text to Portable Text blocks
function textToPortableText(text: string) {
  // Split by double newlines to create separate paragraphs
  const paragraphs = text.split(/\n\n+/).filter(Boolean)

  return paragraphs.map(() => ({
    _type: 'block',
    _key: nanoid(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: nanoid(),
        text: text,
        marks: [],
      },
    ],
  }))
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitTestimonialRequest = await request.json()
    const { token, clientName, clientTitle, quote, testimonialId: existingId, date } = body

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

    await writeClient.createOrReplace(document)

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
