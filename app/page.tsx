import { Hero, Listings, Testimonials } from '@/components'
import { HERO, TESTIMONIALS } from '@/lib/data'
import { client } from '@/lib/client'
import { HOME_PAGE_QUERY } from '@/lib/queries'
import type { Listing, Testimonial } from '@/types'

// Revalidate every hour (or on-demand via webhook)
export const revalidate = 3600

type HomePageData = {
  settings: {
    hero?: { headline: string; subheadline: string }
  } | null
  listings: Listing[]
  testimonials: Testimonial[]
}

async function getHomePageData(): Promise<HomePageData> {
  try {
    const data = await client.fetch<HomePageData>(HOME_PAGE_QUERY)
    return data
  } catch (error) {
    console.error('Failed to fetch from Sanity:', error)
    return { settings: null, listings: [], testimonials: [] }
  }
}

export default async function HomePage() {
  const data = await getHomePageData()

  // Use Sanity data if available, otherwise fall back to static data
  const hero = data.settings?.hero ?? HERO
  const listings = data.listings
  const testimonials = data.testimonials.length > 0 ? data.testimonials : TESTIMONIALS
  console.log('homepage testimonials', testimonials)

  return (
    <>
      <Hero
        headline={hero.headline}
        subheadline={hero.subheadline}
      />
      <Listings listings={listings} />
      <Testimonials testimonials={testimonials} />
    </>
  )
}
