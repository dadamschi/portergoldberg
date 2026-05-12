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
