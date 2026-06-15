/**
 * Token utilities for client review submission
 * Tokens encode a HubSpot contact ID with HMAC signature for verification
 */

import { createHmac } from 'crypto'

function getSecret(): string {
  const secret = process.env.REVIEW_TOKEN_SECRET
  if (!secret) {
    throw new Error('REVIEW_TOKEN_SECRET environment variable not configured')
  }
  return secret
}

/**
 * Generate a signed token for a HubSpot contact ID
 * Format: base64(contactId:hmac)
 */
export function generateReviewToken(contactId: string): string {
  const secret = getSecret()
  const hmac = createHmac('sha256', secret).update(contactId).digest('hex').slice(0, 16)
  const payload = `${contactId}:${hmac}`
  return Buffer.from(payload).toString('base64url')
}

/**
 * Decode and verify a review token
 * Returns the contact ID if valid, null if invalid
 */
export function verifyReviewToken(token: string): string | null {
  try {
    const secret = getSecret()
    const payload = Buffer.from(token, 'base64url').toString('utf-8')
    const [contactId, providedHmac] = payload.split(':')

    if (!contactId || !providedHmac) {
      return null
    }

    const expectedHmac = createHmac('sha256', secret).update(contactId).digest('hex').slice(0, 16)

    if (providedHmac !== expectedHmac) {
      return null
    }

    return contactId
  } catch {
    return null
  }
}
