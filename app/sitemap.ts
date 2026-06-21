import type { MetadataRoute } from 'next'
import { client } from '@/lib/client'

// Revalidate sitemap once a day
export const revalidate = 86400

type NewsletterSitemapData = {
  slug: string
  publishedAt: string
  _updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.portergoldberg.com'

  // Static pages
  const staticPages = [
    { route: '', priority: 1, changeFrequency: 'daily' as const },
    { route: '/about-us', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/buying', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/selling', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/inventory', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/halcyon-development', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/testimonials', priority: 0.7, changeFrequency: 'daily' as const },
    { route: '/events', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/newsletters', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/press', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/client-resources', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/vendors', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { route: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  
    { route: '/school-guidance', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/selling/our-process', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/selling/property-prep', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/selling/staging-services', priority: 0.8, changeFrequency: 'weekly' as const },]

  const staticEntries = staticPages.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  // Fetch dynamic content from Sanity
  try {
    const dynamicData = await client.fetch<{
      listings?: string
      events?: string
      latestNewsletter?: string
      newsletters: NewsletterSitemapData[]
    }>(`{
      "listings": *[_type == "listing"] | order(_updatedAt desc)[0]._updatedAt,
      "events": *[_type == "event"] | order(_updatedAt desc)[0]._updatedAt,
      "latestNewsletter": *[_type == "newsletter"] | order(_updatedAt desc)[0]._updatedAt,
      "newsletters": *[_type == "newsletter"] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    }`)

    // Update lastModified for dynamic pages
    if (dynamicData.listings) {
      const inventoryEntry = staticEntries.find(e => e.url.endsWith('/inventory'))
      if (inventoryEntry) inventoryEntry.lastModified = new Date(dynamicData.listings)
    }

    if (dynamicData.events) {
      const eventsEntry = staticEntries.find(e => e.url.endsWith('/events'))
      if (eventsEntry) eventsEntry.lastModified = new Date(dynamicData.events)
    }

    if (dynamicData.latestNewsletter) {
      const newslettersEntry = staticEntries.find(e => e.url.endsWith('/newsletters'))
      if (newslettersEntry) newslettersEntry.lastModified = new Date(dynamicData.latestNewsletter)
    }

    // Add individual newsletter pages to sitemap
    const newsletterEntries: MetadataRoute.Sitemap = dynamicData.newsletters.map((newsletter) => ({
      url: `${baseUrl}/newsletters/${newsletter.slug}`,
      lastModified: new Date(newsletter._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticEntries, ...newsletterEntries]
  } catch (error) {
    console.error('Failed to fetch Sanity data for sitemap:', error)
    return staticEntries
  }
}
