import type { MetadataRoute } from 'next'
import { client } from '@/lib/client'

// Revalidate sitemap once a day
export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portergoldberg.com'

  // Static pages
  const staticPages = [
    { route: '', priority: 1, changeFrequency: 'daily' as const },
    { route: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/buying', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/selling', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/inventory', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/halcyon-development', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/testimonials', priority: 0.7, changeFrequency: 'daily' as const },
    { route: '/events', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/newsletters', priority: 0.7, changeFrequency: 'weekly' as const },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { route: '/client-resources', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/vendors', priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  const staticEntries = staticPages.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  // Fetch dynamic content from Sanity for last modified dates
  try {
    const lastUpdated = await client.fetch<{ listings?: string; events?: string; newsletters?: string }>(`{
      "listings": *[_type == "listing"] | order(_updatedAt desc)[0]._updatedAt,
      "events": *[_type == "event"] | order(_updatedAt desc)[0]._updatedAt,
      "newsletters": *[_type == "newsletter"] | order(_updatedAt desc)[0]._updatedAt
    }`)

    // Update lastModified for dynamic pages
    if (lastUpdated.listings) {
      const inventoryEntry = staticEntries.find(e => e.url.endsWith('/inventory'))
      if (inventoryEntry) inventoryEntry.lastModified = new Date(lastUpdated.listings)
    }

    if (lastUpdated.events) {
      const eventsEntry = staticEntries.find(e => e.url.endsWith('/events'))
      if (eventsEntry) eventsEntry.lastModified = new Date(lastUpdated.events)
    }

    if (lastUpdated.newsletters) {
      const newslettersEntry = staticEntries.find(e => e.url.endsWith('/newsletters'))
      if (newslettersEntry) newslettersEntry.lastModified = new Date(lastUpdated.newsletters)
    }
  } catch (error) {
    console.error('Failed to fetch Sanity dates for sitemap:', error)
  }

  return staticEntries
}
