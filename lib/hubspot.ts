import { HUBSPOT_CLIENT_ID } from './constants'
const HUBSPOT_API_BASE = 'https://api.hubapi.com'
const NEWSLETTER_SUBSCRIPTION_ID = '341969674'

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export type HubSpotContact = {
  id: string
  email: string
  firstname: string
  lastname: string
  tier: string
  interested_property: string
}

export async function buildHubspotContactLink(contactId: string) {
  return `https://app.hubspot.com/contacts/${HUBSPOT_CLIENT_ID}/record/0-1/${contactId}`
}

export async function searchContactByEmail(email: string): Promise<HubSpotContact | null> {
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: email.toLowerCase(),
        }],
      }],
      properties: ['id','email', 'tier', 'firstname', 'lastname', 'interested_property'],
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
      email: contact.properties.email || '',
      firstname: contact.properties.firstname || '',
      lastname: contact.properties.lastname || '',
      interested_property: contact.properties.interested_property || '',
    }
  }
  return null
}

export async function getContactById(contactId: string): Promise<HubSpotContact | null> {
  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,tier,interested_property`,
    {
      headers: getHeaders(),
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
    tier: data.properties.tier || '',
    interested_property: data.properties.interested_property || '',
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

  // Get associated deals for the contact
  const associationsUrl = `${HUBSPOT_API_BASE}/crm/v4/objects/contacts/${contactId}/associations/deals`
  console.log('[HubSpot] Fetching associations:', associationsUrl)

  const response = await fetch(associationsUrl, {
    headers: getHeaders(),
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
      headers: getHeaders(),
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

export async function updateContactProperty(
  contactId: string,
  propertyName: string,
  propertyValue?: string
): Promise<boolean> {
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({
      properties: { [propertyName]: propertyValue },
    }),
  })

  return response.ok
}

type ContactProperty = {
  property: string
  value: string
}

export async function updateContactProperties(
  contactId: string,
  properties: ContactProperty[]
): Promise<boolean> {
  // Get unique property names and their definitions
  const uniqueProps = [...new Set(properties.map((p) => p.property))]
  const definitions: Record<string, PropertyDefinition> = {}
  const enumerationProps: string[] = []

  for (const prop of uniqueProps) {
    const definition = await getPropertyDefinition(prop)
    definitions[prop] = definition
    if (definition.type === 'enumeration') {
      enumerationProps.push(prop)
    }
  }

  // Fetch current values for enumeration properties
  const currentValues: Record<string, string> = {}
  if (enumerationProps.length > 0) {
    const contactResponse = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}?properties=${enumerationProps.join(',')}`,
      {
        headers: getHeaders(),
      }
    )
    if (contactResponse.ok) {
      const contactData: { properties: Record<string, string> } = await contactResponse.json()
      Object.assign(currentValues, contactData.properties)
    }
  }

  const propertiesObject: Record<string, string> = {}
  for (const { property, value } of properties) {
    const definition = definitions[property]

    if (definition.type === 'enumeration') {
      const optionValue = await ensurePropertyOption(property, value)
      // Use accumulated value if we've already processed this property, otherwise use current from HubSpot
      const baseValue = propertiesObject[property] ?? currentValues[property] ?? ''
      const values = baseValue ? baseValue.split(';').map((v) => v.trim()).filter(Boolean) : []
      if (!values.includes(optionValue)) {
        values.push(optionValue)
      }
      propertiesObject[property] = values.join(';')
    } else {
      propertiesObject[property] = value
    }
  }

  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({
      properties: propertiesObject,
    }),
  })

  return response.ok
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

// =============================================================================
// HIGH-LEVEL SERVICE FUNCTIONS
// =============================================================================

export type AddContactOptions = {
  email: string
  firstName?: string
  lastName?: string
}

export type AddContactResult = {
  success: boolean
  contact: HubSpotContact
  error?: string
}

export async function createContact(
  email: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; conflict?: boolean; error?: string }> {
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      properties: {
        email,
        firstname: firstName,
        lastname: lastName,
        hs_lead_status: 'NEW',
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

/**
   * Get existing contact or create a new one. Always returns a contact ID.
   */
  async function getOrCreateContact(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{ contact: HubSpotContact; created: boolean }> {
    // Try to find existing
    const existing = await searchContactByEmail(email)
    if (existing) {
      return { contact: existing, created: false }
    }

    // Create new
    const result = await createContact(email, firstName, lastName)
    if (!result.success) {
      throw new Error(result.error || 'Failed to create contact')
    }

    // Fetch the newly created contact to get its ID
    const newContact = await searchContactByEmail(email)
    if (!newContact) {
      throw new Error('Contact created but not found')
    }

    return { contact: newContact, created: true }
  }

/**
 * Add or update a contact in HubSpot with specified tiers.
 * If contact exists, adds the tiers to their existing tiers.
 */
export async function addContact(options: AddContactOptions): Promise<AddContactResult> {
  const { email, firstName = '', lastName = '' } = options
  const { contact } = await getOrCreateContact(email, firstName, lastName)

  return { success: true, contact }
}

/**
 * Subscribe an email from the newsletter.
 */
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
  const contact = await searchContactByEmail(email)

  if (!contact) {
    return { success: false, error: 'Contact not found' }
  }

  // do not touch unsubscribed contacts
  const statusRes = await fetch(
    `${HUBSPOT_API_BASE}/communication-preferences/v4/statuses/${encodeURIComponent(email)}?channel=EMAIL`,
    { headers: getHeaders() }
  )

  const statusData = await statusRes.json()
  if (statusData.status === 'UNSUBSCRIBED') {
    return { success: false, error: 'Contact has unsubscribed' }
  }

  if(statusData.results.find((sub: { subscriptionId: string; status: string }) => sub.subscriptionId == NEWSLETTER_SUBSCRIPTION_ID)?.status === 'SUBSCRIBED') {
    return { success: true, message: 'Contact is already subscribed' }
  }

  const response = await fetch(
      `${HUBSPOT_API_BASE}/communication-preferences/v3/subscribe`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          emailAddress: email,
          subscriptionId: NEWSLETTER_SUBSCRIPTION_ID,
          legalBasis: 'LEGITIMATE_INTEREST_CLIENT', 
          legalBasisExplanation: 'User opted in to newsletter via contact form',
        }),
      })

  return { success: response.ok }
}

/**
 * Unsubscribe an email from the newsletter.
 * Removes Newsletter tier from contact.
 */
export async function unsubscribeFromNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const contact = await searchContactByEmail(email)

  if (!contact) {
    return { success: false, error: 'Contact not found' }
  }

  const newTier = removeTierValue(contact.tier, 'Newsletter')
  const updated = await updateContactProperty(contact.id, 'tier', newTier)

  return { success: updated }
}

/**
 * Add a contact to the vendor list.
 */
export async function addToVendorList(
  email: string,
  name?: string
): Promise<AddContactResult> {
  const [firstName, ...lastNameParts] = (name || '').split(' ')
  const lastName = lastNameParts.join(' ')

  return addContact({
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined
  })
}

// =============================================================================
// VENDOR FETCHING
// =============================================================================

export async function fetchVendors(): Promise<HubSpotVendor[]> {
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
        headers: getHeaders(),
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

// =============================================================================
// MULTI-SELECT PROPERTY OPTIONS
// =============================================================================

export type PropertyOption = {
  label: string
  value: string
  displayOrder: number
  hidden: boolean
}

export type PropertyDefinition = {
  name: string
  label: string
  type: string
  options: PropertyOption[]
}

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 1 week
const propertyDefinitionCache: Map<string, { data: PropertyDefinition; timestamp: number }> = new Map()

export async function getPropertyDefinition(propertyName: string): Promise<PropertyDefinition> {
  const cached = propertyDefinitionCache.get(propertyName)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/properties/contacts/${propertyName}`,
    {
      headers: getHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to get property ${propertyName}: ${error.message || response.status}`)
  }

  const data: PropertyDefinition = await response.json()
  propertyDefinitionCache.set(propertyName, { data, timestamp: Date.now() })
  return data
}

export async function getAllPropertyDefinitions(): Promise<PropertyDefinition[]> {
  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/properties/contacts`,
    {
      headers: getHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to get properties: ${error.message || response.status}`)
  }

  const data: { results: PropertyDefinition[] } = await response.json()
  return data.results
}

export async function ensurePropertyOption(
  propertyName: string,
  optionLabel: string
): Promise<string> {
  const property = await getPropertyDefinition(propertyName)

  const existing = property.options.find(
    (opt) => opt.label.toLowerCase() === optionLabel.toLowerCase()
  )
  if (existing) {
    return existing.value
  }

  const newValue = optionLabel.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')

  const valueExists = property.options.find((opt) => opt.value === newValue)
  if (valueExists) {
    throw new Error(`Option value "${newValue}" already exists with label "${valueExists.label}"`)
  }

  const maxOrder = Math.max(0, ...property.options.map((opt) => opt.displayOrder))
  const newOption: PropertyOption = {
    label: optionLabel,
    value: newValue,
    displayOrder: maxOrder + 1,
    hidden: false,
  }

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/properties/contacts/${propertyName}`,
    {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        options: [...property.options, newOption],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to add option to ${propertyName}: ${error.message || response.status}`)
  }

  // Invalidate cache since we added a new option
  propertyDefinitionCache.delete(propertyName)

  return newValue
}

export async function addMultiSelectValue(
  contactId: string,
  propertyName: string,
  optionLabel: string
): Promise<boolean> {
  const optionValue = await ensurePropertyOption(propertyName, optionLabel)

  const response = await fetch(
    `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}?properties=${propertyName}`,
    {
      headers: getHeaders(),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch contact ${contactId}`)
  }

  const contactData: { properties: HubSpotContact & { [key: string]: string } } = await response.json()
  const currentValue = contactData.properties[propertyName] || ''

  const values = currentValue ? currentValue.split(';').map((v) => v.trim()).filter(Boolean) : []
  if (!values.includes(optionValue)) {
    values.push(optionValue)
  }

  return updateContactProperty(contactId, propertyName, values.join(';'))
}
