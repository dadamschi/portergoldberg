/**
 * Adds UTM tracking parameters to external URLs
 */

type UtmParams = {
  source?: string
  medium?: string
  campaign?: string
}

const DEFAULT_UTM: UtmParams = {
  source: 'pg-chicago',
  medium: 'website',
}

export function addUtmParams(
  url: string,
  params: UtmParams = {}
): string {
  if (!url) return url

  // Skip internal links and anchors
  if (url.startsWith('/') || url.startsWith('#')) {
    return url
  }

  try {
    const urlObj = new URL(url)

    // Skip portergoldberg.com links
    if (urlObj.hostname.includes('portergoldberg.com')) {
      return url
    }

    const merged = { ...DEFAULT_UTM, ...params }

    if (merged.source) urlObj.searchParams.set('utm_source', merged.source)
    if (merged.medium) urlObj.searchParams.set('utm_medium', merged.medium)
    if (merged.campaign) urlObj.searchParams.set('utm_campaign', merged.campaign)

    return urlObj.toString()
  } catch {
    // Invalid URL, return as-is
    return url
  }
}
