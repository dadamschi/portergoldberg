import { NextRequest, NextResponse } from 'next/server'

const HUBSPOT_API_BASE = 'https://api.hubapi.com'

function getApiKey(): string {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) {
    throw new Error('HUBSPOT_API_KEY environment variable is required')
  }
  return apiKey
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, searchType } = await request.json()

    if (!searchTerm || !searchType) {
      return NextResponse.json(
        { error: 'Missing searchTerm or searchType' },
        { status: 400 }
      )
    }

    const apiKey = getApiKey()

    // Determine which property to search
    const propertyName = searchType === 'lastname' ? 'lastname' : 'interested_property'

    const response = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName,
                  operator: 'CONTAINS_TOKEN',
                  value: searchTerm,
                },
              ],
            },
          ],
          properties: ['firstname', 'lastname', 'email', 'contact_type', 'review_link'],
          limit: 100,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      contacts: data.results.map((contact: any) => ({
        id: contact.id,
        firstname: contact.properties.firstname || '',
        lastname: contact.properties.lastname || '',
        email: contact.properties.email || '',
        contact_type: contact.properties.contact_type || '',
        review_link: contact.properties.review_link || '',
      })),
    })
  } catch (error) {
    console.error('Search contacts error:', error)
    return NextResponse.json(
      { error: 'Failed to search contacts' },
      { status: 500 }
    )
  }
}
