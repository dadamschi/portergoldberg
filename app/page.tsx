import type { Metadata } from 'next'
import { Hero, Listings, Testimonials } from '@/components'
import { HERO } from '@/lib/data'
import { client } from '@/lib/client'
import { HOME_PAGE_QUERY } from '@/lib/queries'
import type { Listing, Testimonial, Agent } from '@/types'

export const metadata: Metadata = {
  title: 'Chicago Real Estate | Porter Goldberg Residential',
  description: 'Chicago real estate, personally delivered. Samantha Porter & Lauren Goldberg offer boutique expertise for buying, selling, and building homes in Chicago\'s North Side neighborhoods.',
  alternates: {
    canonical: 'https://portergoldberg.com',
  },
}

// Revalidate every hour (or on-demand via webhook)
export const revalidate = 86400

type HomePageData = {
  settings: {
    hero?: { headline: string; subheadline: string }
  } | null
  listings: Listing[]
  testimonials: Testimonial[]
  agents: Agent[]
}

async function getHomePageData(): Promise<HomePageData> {
  try {
    const data = await client.fetch<HomePageData>(HOME_PAGE_QUERY)
    return data
  } catch (error) {
    console.error('Failed to fetch from Sanity:', error)
    return { settings: null, listings: [], testimonials: [], agents: [] }
  }
}

export default async function HomePage() {
  const data = await getHomePageData()

  // Use Sanity data if available, otherwise fall back to static data
  const listings = data.listings
  const testimonials = data.testimonials

  return (
    <>
      <Hero />
      <Listings listings={listings} />
      <Testimonials testimonials={testimonials} />
    </>
  )
}
