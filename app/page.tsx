import type { Metadata } from 'next'
import { Hero, Listings, Testimonials } from '@/components'
import { HomeFAQ } from '@/components/HomeFAQ'
import { client } from '@/lib/client'
import { HOME_PAGE_QUERY } from '@/lib/queries'
import type { Listing, Testimonial, Agent } from '@/types'
import type { PortableTextBlock } from '@portabletext/types'

export const metadata: Metadata = {
  title: 'Chicago Luxury Real Estate | PorterGoldberg Residential',
  description: 'Chicago luxury real estate experts Samantha Porter & Lauren Goldberg deliver boutique service for Lincoln Park, Lakeview & North Side. 44 years experience, $550M+ in sales.',
  alternates: {
    canonical: 'https://www.portergoldberg.com',
  },
}

// Revalidate every hour (or on-demand via webhook)
export const revalidate = 86400

type HomePageData = {
  settings: {
    hero?: { headline: string; subheadline: string }
    heroBio?: PortableTextBlock[]
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

type HomePageProps = {
  searchParams: Promise<{ showfaq?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const data = await getHomePageData()
  const params = await searchParams

  // Use Sanity data if available, otherwise fall back to static data
  const featuredListings = [...data.listings].sort((a, b) => a.featuredOrder! - b.featuredOrder!);
  const testimonials = data.testimonials
  const heroBio = data.settings?.heroBio

  // Show FAQ only when ?showfaq=true
  const showFAQ = params.showfaq === 'true'

  return (
    <>
      <Hero heroBio={heroBio} />
      <Listings listings={featuredListings} isFeatured />
      <Testimonials testimonials={testimonials} />
      {showFAQ && <HomeFAQ />}
    </>
  )
}
