// =============================================================================
// SITE CONTENT TYPES
// =============================================================================

export type NavItem = {
  label: string
  href?: string
  children?: NavItem[]
}

export type Stat = {
  value: number
  display: string
  label: string
  description: string
}

export type Listing = {
  _id: string
  address: string
  neighborhood: string
  price?: string
  status: string
  statusType: 'active' | 'coming' | 'sold'
  image?: SanityImage
  brochureUrl?: string
  isHalcyonProject?: boolean
  units?: number
}

import type { PortableTextBlock } from '@portabletext/types'

export type Testimonial = {
  _id: string
  _createdAt: string
  clientName: string
  clientTitle?: string
  quote: PortableTextBlock[]
  pinOnHomePage?: boolean
  order?: number
}

export type Agent = {
  _id: string
  name: string
  initials: string
  phone: string
  email: string
  photo?: SanityImage
  fallbackColor?: string
  bio?: AgentBio
}

export type AgentBio = {
  summary?: string
  biography?: PortableTextBlock[]
}

export type SocialLink = {
  platform: string
  url: string
}

export type HeroContent = {
  headline: string
  subheadline: string
}

export type AboutContent = {
  sectionLabel: string
  headline: string
  intro: string[]
  tagline: string
}

export type ProcessStep = {
  _key: string
  title: string
  description: string
  icon?: SanityImage
}

export type SiteSettings = {
  companyName: string
  affiliation: string
  hero: HeroContent
  stats: Stat[]
  about: AboutContent
  social: SocialLink[]
}

// =============================================================================
// SANITY TYPES
// =============================================================================

export type SanityImage = {
  asset: {
    _id: string
    url: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width: number
        height: number
      }
    }
  }
  alt?: string
}

export type EventSession = {
  _key: string
  startTime: string
  endTime: string
  speakerName: string
  speakerOrganization?: string
  topics?: string[]
}

export type ReplayUrl = {
  _key: string
  replaySessionUrl: string
  replaySessionPartDefinition?: string
}

export type EventItem = {
  _id: string
  title: string
  date: string
  endDate?: string
  description: string
  image?: SanityImage
  registrationUrl?: string
  replayUrls?: ReplayUrl[]
  speakerName?: string
  speakerTitle?: string
  speakerPhoto?: SanityImage
  location?: string
  tags?: string[]
  schedule?: EventSession[]
}

export type HomePageData = {
  settings: SiteSettings
  listings: Listing[]
  testimonials: Testimonial[]
  agents: Agent[]
}
