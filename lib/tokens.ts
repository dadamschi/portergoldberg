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
 * Generate a signed token for one or more HubSpot contact IDs
 * Format: base64(contactId1,contactId2:hmac)
 */
export function generateReviewToken(contactIds: string | string[]): string {
  const secret = getSecret()
  const idsString = Array.isArray(contactIds) ? contactIds.join(',') : contactIds
  const hmac = createHmac('sha256', secret).update(idsString).digest('hex').slice(0, 16)
  const payload = `${idsString}:${hmac}`
  return Buffer.from(payload).toString('base64url')
}

/**
 * Decode and verify a review token
 * Returns array of contact IDs if valid, null if invalid
 */
export function verifyReviewToken(token: string): string[] | null {
  try {
    const secret = getSecret()
    const payload = Buffer.from(token, 'base64url').toString('utf-8')
    const [contactIds, providedHmac] = payload.split(':')

    if (!contactIds || !providedHmac) {
      return null
    }

    const expectedHmac = createHmac('sha256', secret).update(contactIds).digest('hex').slice(0, 16)

    if (providedHmac !== expectedHmac) {
      return null
    }

    return contactIds.split(',')
  } catch {
    return null
  }
}
