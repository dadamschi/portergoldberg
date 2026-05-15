import { addUtmParams } from './utm'

export type LinkType = 'contact' | 'external' | 'internal'

export type ParsedLink = {
  type: LinkType
  href: string
  contactMessage?: string
}

/**
 * Parse a link URL and determine its type and properties.
 *
 * @example
 * parseLink('#contact:Hello') // { type: 'contact', href: '#contact:Hello', contactMessage: 'Hello' }
 * parseLink('https://example.com') // { type: 'external', href: 'https://example.com' }
 * parseLink('/about') // { type: 'internal', href: '/about' }
 */
export function parseLink(url: string): ParsedLink {
  if (url.startsWith('#contact:')) {
    return {
      type: 'contact',
      href: url,
      contactMessage: decodeURIComponent(url.replace('#contact:', '')),
    }
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      type: 'external',
      href: url,
    }
  }

  return {
    type: 'internal',
    href: url,
  }
}

/**
 * Check if a URL is an external link.
 */
export function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

/**
 * Check if a URL is a contact link (#contact: pattern).
 */
export function isContactLink(url: string): boolean {
  return url.startsWith('#contact:')
}

/**
 * Get the contact message from a #contact: URL.
 */
export function getContactMessage(url: string): string {
  return decodeURIComponent(url.replace('#contact:', ''))
}

/**
 * Get link props for an anchor element based on URL type.
 * Returns href (with UTM for external), target, and rel attributes.
 */
export function getLinkProps(url: string, utmCampaign = 'content'): {
  href: string
  target?: '_blank'
  rel?: 'noopener noreferrer'
} {
  if (isExternalLink(url)) {
    return {
      href: addUtmParams(url, { campaign: utmCampaign }),
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  return { href: url }
}
