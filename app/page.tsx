import type { Metadata } from 'next'
import { Hero, Listings, Testimonials } from '@/components'
import { FAQJsonLd } from '@/components/JsonLd'
import { client } from '@/lib/client'
import { HOME_PAGE_QUERY } from '@/lib/queries'
import type { Listing, Testimonial, Agent } from '@/types'

export const metadata: Metadata = {
  title: 'Chicago Real Estate | PorterGoldberg Residential',
  description: 'Chicago real estate, personally delivered. Samantha Porter & Lauren Goldberg offer boutique expertise for buying, selling, and building homes in Chicago\'s North Side neighborhoods.',
  alternates: {
    canonical: 'https://www.portergoldberg.com',
  },
}

const HOME_FAQS = [
  {
    question: 'What areas of Chicago does PorterGoldberg serve?',
    answer: 'PorterGoldberg Residential specializes in Chicago\'s North Side neighborhoods including Lincoln Park, Lakeview, Bucktown, Wicker Park, Old Town, Gold Coast, North Center, and surrounding areas.',
  },
  {
    question: 'What is PorterGoldberg\'s experience in Chicago real estate?',
    answer: 'Samantha Porter and Lauren Goldberg have 44 years of combined experience in residential real estate, with over $550 million in career sales. 85% of their business comes from client referrals.',
  },
  {
    question: 'Does PorterGoldberg handle new construction homes?',
    answer: 'Yes. PorterGoldberg is the exclusive sales representative for Halcyon Development, a premier Chicago builder specializing in luxury new construction homes.',
  },
  {
    question: 'What brokerage is PorterGoldberg affiliated with?',
    answer: 'PorterGoldberg Residential operates under Jameson Sotheby\'s International Realty, providing access to a global luxury real estate network and premium marketing resources.',
  },
]

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
      <FAQJsonLd faqs={HOME_FAQS} />
      <Hero />
      <Listings listings={listings} />
      <Testimonials testimonials={testimonials} />
    </>
  )
}
