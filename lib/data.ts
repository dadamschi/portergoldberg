import type { NavItem, Stat, AboutContent, HeroContent } from '@/types'

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV_ITEMS: NavItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Buying', href: '/buying' },
  {
    label: 'Selling',
    children: [
      { label: 'Our Process', href: '/our-process' },
      { label: 'Property Preparation', href: '/property-prep' },
      { label: 'Staging Services', href: '/staging-services' },
    ],
  },
  { label: 'Properties', href: '/inventory' },
  { label: 'Halcyon Development', href: '/halcyon-development' },
  { label: 'Testimonials', href: '/testimonials' },
  {
    label: 'Client Resources',
    children: [
      { label: 'Our Trusted Vendors', href: '/vendors' },
      { label: 'Local School Guidance', href: '/schools' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Press', href: '/press' },
]

// =============================================================================
// HERO
// =============================================================================

export const HERO: HeroContent = {
  headline: 'Chicago Real Estate, Personally Delivered',
  subheadline: 'Samantha Porter & Lauren Goldberg — boutique expertise for buying, selling, and building in Chicago.',
}

// =============================================================================
// STATS
// =============================================================================

export const STATS: Stat[] = [
  {
    value: 25,
    display: '25+',
    label: 'Combined Years',
    description: 'Combined expertise and experience in residential brokerage services',
  },
  {
    value: 95,
    display: '95%',
    label: 'Referral',
    description: 'Client base that confidently recommends our personal service and advocacy',
  },
  {
    value: 500,
    display: '$500M+',
    label: 'Career Sales',
    description: 'Career sales of existing homes, new construction, and land acquisitions',
  },
]

// =============================================================================
// ABOUT
// =============================================================================

export const ABOUT: AboutContent = {
  sectionLabel: 'Who We Are',
  headline: 'Buying, Selling, Owning Starts Here',
  intro: [
    "Real estate is personal — and so is our approach. We don't simply advise; we collaborate, advocate, and help shape the lifestyle you're building. The process — buying, selling, or creating something new — should feel seamless and smart.",
    'With complementary perspectives and a deep understanding of Chicago real estate, Samantha Porter and Lauren Goldberg anticipate challenges, identify opportunities, and connect you to the resources that matter.',
  ],
  tagline: "Anchored in the trusted integrity of Jameson Sotheby's International Realty — peerless client service, technology-forward resources, and a powerful global referral network.",
}
