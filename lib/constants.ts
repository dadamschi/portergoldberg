// =============================================================================
// SITE CONFIGURATION
// =============================================================================

export const SITE_URL = 'https://www.portergoldberg.com'
export const HUBSPOT_CLIENT_ID='46095216'

// =============================================================================
// EMAIL ADDRESSES
// =============================================================================

export const EMAIL_INFO = 'info@portergoldberg.com'
export const EMAIL_TEAM = 'team@portergoldberg.com'

// Notification recipients for form submissions and alerts
export const EMAIL_NOTIFICATION_RECIPIENTS =
  process.env.NODE_ENV === 'production'
    ? [EMAIL_INFO, 'contact@artplexity.com']
    : ['dadams.chi@gmail.com']

// =============================================================================
// AGENT CONTACT INFO
// =============================================================================

export const AGENT_SAMANTHA = {
  name: 'Samantha Porter',
  email: 'samantha@portergoldberg.com',
  phone: '312-944-8900',
}

export const AGENT_LAUREN = {
  name: 'Lauren Goldberg',
  email: 'lauren@portergoldberg.com',
  phone: '773-576-0053',
}

// =============================================================================
// BUSINESS INFO
// =============================================================================

export const BUSINESS_INFO = {
  name: 'PorterGoldberg Residential',
  brokerage: "Jameson Sotheby's International Realty",
  address: '425 W. North Avenue',
  city: 'Chicago',
  state: 'IL',
  zip: '60610',
  phone: '312-944-8900',
  email: EMAIL_INFO,
}
