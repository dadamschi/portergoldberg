import { NextRequest, NextResponse } from 'next/server'
import { generateReviewToken } from '@/lib/tokens'

const HUBSPOT_API_BASE = 'https://api.hubapi.com'
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
    if (!process.env.HUBSPOT_API_KEY) {
      throw new Error('HUBSPOT_API_KEY not configured')
    }

    // Generate the review link
    const token = generateReviewToken(String(contactId))
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portergoldberg.com'
    const reviewLink = `${baseUrl}/submit-review/${token}`

    // Save to HubSpot contact
    const updateResponse = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            [REVIEW_LINK_PROPERTY]: reviewLink,
          },
        }),
      }
    )

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      console.error('HubSpot update failed:', error)
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
