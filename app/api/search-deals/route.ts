import { NextRequest, NextResponse } from 'next/server'

const HUBSPOT_API_BASE = 'https://api.hubapi.com'

function getApiKey(): string {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) {
    throw new Error('HUBSPOT_API_KEY environment variable is required')
  }
  return apiKey
}

async function searchDeals(searchTerm: string) {
  const apiKey = getApiKey()

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/deals/search`,
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
                propertyName: 'dealname',
                operator: 'CONTAINS_TOKEN',
                value: searchTerm
              }
            ]
          }
        ],
        properties: ['dealname', 'dealstage', 'amount'],
        limit: 100
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to search deals: ${response.status}`)
  }

  const data = await response.json()
  return data.results || []
}

async function getDealContacts(dealId: string) {
  const apiKey = getApiKey()

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/deals/${dealId}/associations/contacts`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  )

  if (!response.ok) {
    return []
  }

  const data = await response.json() as { results?: Array<{ id: string }> }
  const contactIds = data.results?.map((r) => r.id) || []

  if (contactIds.length === 0) {
    return []
  }

  // Fetch contact details
  const contactsResponse = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/batch/read`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: ['firstname', 'lastname', 'email', 'contact_type'],
        inputs: contactIds.map((id: string) => ({ id }))
      }),
    }
  )

  if (!contactsResponse.ok) {
    return []
  }

  const contactsData = await contactsResponse.json()
  return contactsData.results || []
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm } = await request.json()

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Missing searchTerm' },
        { status: 400 }
      )
    }

    const deals = await searchDeals(searchTerm)

    // Fetch contacts for each deal
    const dealsWithContacts = await Promise.all(
      deals.map(async (deal: { id: string; properties: Record<string, string> }) => {
        const contacts = await getDealContacts(deal.id) as Array<{ id: string; properties: Record<string, string> }>
        return {
          id: deal.id,
          dealname: deal.properties.dealname || '',
          dealstage: deal.properties.dealstage || '',
          amount: deal.properties.amount || '0',
          contacts: contacts.map((c) => ({
            id: c.id,
            firstname: c.properties.firstname || '',
            lastname: c.properties.lastname || '',
            email: c.properties.email || '',
            contact_type: c.properties.contact_type || '',
          })),
        }
      })
    )

    return NextResponse.json({ deals: dealsWithContacts })
  } catch (error) {
    console.error('Search deals error:', error)
    return NextResponse.json(
      { error: 'Failed to search deals' },
      { status: 500 }
    )
  }
}
