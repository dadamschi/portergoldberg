import { NextRequest, NextResponse } from 'next/server'
import { generateReviewToken } from '@/lib/tokens'
import { updateContactProperty } from '@/lib/hubspot'

const REVIEW_LINK_PROPERTY = 'review_link'

/**
 * Webhook endpoint for HubSpot to generate review links
 *
 * Formats supported:
 * - Single contact: { "contactId": "12345" }
 * - Multiple contacts: { "contactIds": ["12345", "67890"] }
 * - HubSpot workflow: { "object": { "objectId": 12345 } }
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

    // Handle multiple formats
    let contactIds: string[]
    if (body.contactIds && Array.isArray(body.contactIds)) {
      // Array of contact IDs
      contactIds = body.contactIds.map(String)
    } else {
      // Single contact ID (various formats)
      const singleId = body.contactId || body.object?.objectId || body.objectId
      if (!singleId) {
        return NextResponse.json(
          { error: 'Missing contactId or contactIds' },
          { status: 400 }
        )
      }
      contactIds = [String(singleId)]
    }

    // Check required env vars
    if (!process.env.REVIEW_TOKEN_SECRET) {
      throw new Error('REVIEW_TOKEN_SECRET not configured')
    }

    // Generate the review link (supports multiple contact IDs)
    const token = generateReviewToken(contactIds)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portergoldberg.com'
    const reviewLink = `${baseUrl}/submit-review/${token}`

    // Save the same review link to all contacts
    const updates = await Promise.all(
      contactIds.map(id => updateContactProperty(id, REVIEW_LINK_PROPERTY, reviewLink))
    )

    const allSucceeded = updates.every(Boolean)

    if (!allSucceeded) {
      console.error('HubSpot update failed for some contacts:', contactIds)
      return NextResponse.json(
        { error: 'Failed to update one or more contacts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contactIds,
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
