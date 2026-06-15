const HUBSPOT_API_BASE = 'https://api.hubapi.com'

function getApiKey(): string {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) {
    throw new Error('HUBSPOT_API_KEY environment variable not configured')
  }
  return apiKey
}

export type HubSpotContact = {
  id: string
  tier: string
}

export type HubSpotContactDetails = {
  id: string
  firstname: string
  lastname: string
  email: string
}

export async function searchContactByEmail(email: string): Promise<HubSpotContact | null> {
  const apiKey = getApiKey()
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: email,
        }],
      }],
      properties: ['email', 'tier'],
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  if (data.results && data.results.length > 0) {
    const contact = data.results[0]
    return {
      id: contact.id,
      tier: contact.properties.tier || '',
    }
  }
  return null
}

export async function getContactById(contactId: string): Promise<HubSpotContactDetails | null> {
  const apiKey = getApiKey()
  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  )

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return {
    id: data.id,
    firstname: data.properties.firstname || '',
    lastname: data.properties.lastname || '',
    email: data.properties.email || '',
  }
}

export type HubSpotDeal = {
  id: string
  dealname: string
  pipeline: string
  dealstage: string
  closedate: string | null
}

export async function getContactDeals(contactId: string): Promise<HubSpotDeal[]> {
  const apiKey = getApiKey()

  // Get associated deals for the contact
  const associationsUrl = `${HUBSPOT_API_BASE}/crm/v4/objects/contacts/${contactId}/associations/deals`
  console.log('[HubSpot] Fetching associations:', associationsUrl)

  const response = await fetch(associationsUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    console.log('[HubSpot] Associations failed:', response.status)
    return []
  }

  const associations = await response.json()
  console.log('[HubSpot] Associations response:', JSON.stringify(associations, null, 2))

  const dealIds = associations.results?.map((r: { toObjectId: number }) => r.toObjectId) || []

  if (dealIds.length === 0) {
    console.log('[HubSpot] No deal associations found')
    return []
  }

  console.log('[HubSpot] Deal IDs:', dealIds)

  // Fetch deal details
  const dealsResponse = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/deals/batch/read`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: dealIds.map((id: number) => ({ id: String(id) })),
        properties: ['dealname', 'pipeline', 'dealstage', 'closedate'],
      }),
    }
  )

  if (!dealsResponse.ok) {
    console.log('[HubSpot] Deals fetch failed:', dealsResponse.status)
    return []
  }

  const dealsData = await dealsResponse.json()
  console.log('[HubSpot] Deals response:', JSON.stringify(dealsData, null, 2))

  // Sort by closedate descending (most recent first)
  const deals: HubSpotDeal[] = (dealsData.results || [])
    .map((deal: { id: string; properties: { dealname?: string; pipeline?: string; dealstage?: string; closedate?: string } }) => ({
      id: deal.id,
      dealname: deal.properties.dealname || '',
      pipeline: deal.properties.pipeline || '',
      dealstage: deal.properties.dealstage || '',
      closedate: deal.properties.closedate || null,
    }))
    .sort((a: HubSpotDeal, b: HubSpotDeal) => {
      if (!a.closedate) return 1
      if (!b.closedate) return -1
      return new Date(b.closedate).getTime() - new Date(a.closedate).getTime()
    })

  return deals
}

export async function updateContactTier(contactId: string, tier: string): Promise<boolean> {
  const apiKey = getApiKey()
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { tier },
    }),
  })

  return response.ok
}

export async function createContact(
  email: string,
  firstName: string,
  lastName: string,
  tier: string
): Promise<{ success: boolean; conflict?: boolean; error?: string }> {
  const apiKey = getApiKey()
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email,
        firstname: firstName,
        lastname: lastName,
        lifecyclestage: 'subscriber',
        tier,
      },
    }),
  })

  if (response.ok) {
    return { success: true }
  }

  if (response.status === 409) {
    return { success: false, conflict: true }
  }

  const errorData = await response.json()
  return { success: false, error: errorData.message || `HTTP ${response.status}` }
}

export function addTierValue(currentTier: string, valueToAdd: string): string {
  const values = currentTier ? currentTier.split(';').map(v => v.trim()).filter(Boolean) : []
  if (!values.includes(valueToAdd)) {
    values.push(valueToAdd)
  }
  return values.join(';')
}

export function removeTierValue(currentTier: string, valueToRemove: string): string {
  const values = currentTier ? currentTier.split(';').map(v => v.trim()).filter(Boolean) : []
  return values.filter(v => v !== valueToRemove).join(';')
}

export type HubSpotVendor = {
  category: string
  firstName?: string
  lastName?: string
  company?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  website?: string
  instagram?: string
  isPersonalContact?: boolean
}

export async function fetchVendors(): Promise<HubSpotVendor[]> {
  const apiKey = getApiKey()
  const vendors: HubSpotVendor[] = []
  let after: string | undefined

  // Paginate through all vendors
  do {
    const params = new URLSearchParams({
      limit: '100',
      properties: 'firstname,lastname,company,phone,email,website,address,city,vendor_category',
    })
    if (after) {
      params.set('after', after)
    }

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
                  propertyName: 'sales_contact_type',
                  operator: 'EQ',
                  value: 'Vendor',
                },
              ],
            },
          ],
          properties: [
            'firstname',
            'lastname',
            'company',
            'phone',
            'email',
            'website',
            'address',
            'city',
            'vendor_category',
            'tier',
          ],
          limit: 100,
          after,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`)
    }

    const data = await response.json()

    for (const contact of data.results || []) {
      const props = contact.properties
      if (props.vendor_category) {
        const tier = props.tier || ''
        vendors.push({
          category: props.vendor_category,
          firstName: props.firstname || undefined,
          lastName: props.lastname || undefined,
          company: props.company || undefined,
          address: props.address || undefined,
          city: props.city || undefined,
          phone: props.phone || undefined,
          email: props.email || undefined,
          website: props.website || undefined,
          isPersonalContact: tier.includes('Personal Contact'),
        })
      }
    }

    after = data.paging?.next?.after
  } while (after)

  // Sort by category, then by company/name
  return vendors.sort((a, b) => {
    const catCompare = a.category.localeCompare(b.category)
    if (catCompare !== 0) return catCompare
    const aName = a.company || `${a.firstName} ${a.lastName}`
    const bName = b.company || `${b.firstName} ${b.lastName}`
    return aName.localeCompare(bName)
  })
}
