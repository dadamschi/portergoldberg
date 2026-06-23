import { NextRequest, NextResponse } from 'next/server'
import { generateReviewToken } from '@/lib/tokens'
import { updateContactProperty } from '@/lib/hubspot'

const REVIEW_LINK_PROPERTY = 'review_link'

/**
 * Webhook endpoint for HubSpot to generate review links
 *
 * HubSpot workflow sends: { "object": { "objectId": 12345 } }
 * Or custom call sends: { "contactId": "12345" }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.HUBSPOT_WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Handle both HubSpot workflow format and direct calls
    const contactId = body.contactId || body.object?.objectId || body.objectId

    if (!contactId) {
      return NextResponse.json(
        { error: 'Missing contactId' },
        { status: 400 }
      )
    }

    // Check required env vars
    if (!process.env.REVIEW_TOKEN_SECRET) {
      throw new Error('REVIEW_TOKEN_SECRET not configured')
    }

    // Generate the review link
    const token = generateReviewToken(String(contactId))
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portergoldberg.com'
    const reviewLink = `${baseUrl}/submit-review/${token}`

    // Save to HubSpot contact
    const updated = await updateContactProperty(
      String(contactId),
      REVIEW_LINK_PROPERTY,
      reviewLink
    )

    if (!updated) {
      console.error('HubSpot update failed for contact:', contactId)
      return NextResponse.json(
        { error: 'Failed to update contact' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contactId,
      reviewLink,
    })
  } catch (error) {
    console.error('Generate review link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
