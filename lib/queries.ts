import { defineQuery } from 'next-sanity'

// =============================================================================
// IMAGE FRAGMENT
// =============================================================================

export const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt
`

// =============================================================================
// LISTINGS
// =============================================================================

export const LISTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "listing" && featured == true] | order(order asc) {
    _id,
    address,
    neighborhood,
    price,
    status,
    statusType,
    "image": image { ${imageFragment} },
    fallbackColor,
    brochureUrl
  }
`)

export const ALL_LISTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "listing"] | order(order asc) {
    _id,
    address,
    neighborhood,
    price,
    status,
    statusType,
    "image": image { ${imageFragment} },
    fallbackColor,
    brochureUrl
  }
`)

// =============================================================================
// TESTIMONIALS
// =============================================================================

export const TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id,
    clientName,
    clientTitle,
    quote
  }
`)

export const ALL_TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial"] | order(order asc) {
    _id,
    clientName,
    clientTitle,
    quote
  }
`)

// =============================================================================
// AGENTS
// =============================================================================

export const AGENTS_QUERY = defineQuery(/* groq */ `
  *[_type == "agent"] | order(order asc) {
    _id,
    name,
    initials,
    phone,
    email,
    "photo": photo { ${imageFragment} },
    fallbackColor,
    bio
  }
`)

// =============================================================================
// SITE SETTINGS (Singleton)
// =============================================================================

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    companyName,
    affiliation,
    hero {
      headline,
      subheadline
    },
    stats[] {
      display,
      value,
      label,
      description
    },
    about {
      sectionLabel,
      headline,
      introParagraphs,
      tagline
    },
    social[] {
      platform,
      url
    }
  }
`)

// =============================================================================
// SELLING PROCESS (Singleton)
// =============================================================================

export const SELLING_PROCESS_QUERY = defineQuery(/* groq */ `
  *[_type == "sellingProcess"][0] {
    headline,
    intro,
    tagline,
    steps[] {
      _key,
      title,
      description,
      "icon": icon { ${imageFragment} }
    },
    marketingTypes
  }
`)

// =============================================================================
// COMBINED HOME PAGE QUERY
// =============================================================================

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `{
  "settings": *[_type == "siteSettings"][0] {
    companyName,
    affiliation,
    hero { headline, subheadline },
    stats[] { display, value, label, description },
    about { sectionLabel, headline, introParagraphs, tagline },
    social[] { platform, url }
  },
  "listings": *[_type == "listing" && featured == true] | order(order asc) [0...4] {
    _id,
    address,
    neighborhood,
    price,
    status,
    statusType,
    "image": image { ${imageFragment} },
    fallbackColor,
    brochureUrl
  },
  "testimonials": *[_type == "testimonial" && featured == true] | order(order asc) [0...5] {
    _id,
    clientName,
    clientTitle,
    quote
  },
  "agents": *[_type == "agent"] | order(order asc) {
    _id,
    name,
    initials,
    phone,
    email,
    "photo": photo { ${imageFragment} },
    fallbackColor
  }
}`)
