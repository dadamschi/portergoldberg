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
    city,
    price,
    beds,
    baths,
    sqft,
    status,
    statusType,
    units,
    "image": image { ${imageFragment} },
    brochureUrl
  }
`)

export const ALL_LISTINGS_QUERY = defineQuery(/* groq */ `
 {
    "available": *[_type == "listing" && statusType in ["active", "coming"]] {
          _id,
          address,
          neighborhood,
          price,
          beds,
          baths,
          sqft,
          status,
          statusType,
          units,
          "image": image { ${imageFragment} },
          brochureUrl,
          featured,
          featuredOrder
        },
    "sold": *[_type == "listing" && statusType == "sold" && defined(soldOrder)] |
      order(soldOrder asc) {
          _id,
          address,
          neighborhood,
          price,
          beds,
          baths,
          sqft,
          status,
          statusType,
          units,
          "image": image { ${imageFragment} },
          brochureUrl,
          featured,
          featuredOrder
        }
  }
  `) 

// =============================================================================
// TESTIMONIALS
// =============================================================================

export const ALL_TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial"] | order(defined(order) asc, order asc, _createdAt desc) {
    _id,
    clientName,
    clientTitle,
    date,
    quote,
    pinOnHomePage,
    order
  }
`)

export const TESTIMONIAL_BY_HUBSPOT_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial" && hubspotContactId == $hubspotContactId] | order(_id asc)[0] {
    _id,
    clientName,
    clientTitle,
    date,
    quote
  }
`)

 export const UNPUBLISHED_DRAFTS_QUERY = defineQuery(/* groq */ `
    *[
      _type == "testimonial" 
      && _id match "drafts.*"
      && count(*[_id == string::split(^._id, "drafts.")[1]]) == 0
    ] | order(_createdAt desc) {
      _id,
      clientName,
      clientTitle,
      date,
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
    biography {
      summary,
      biography
    }
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
// EVENTS
// =============================================================================

export const UPCOMING_EVENTS_QUERY = defineQuery(/* groq */ `
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    title,
    date,
    endDate,
    description,
    "image": image { ${imageFragment} },
    registrationUrl,
    speakerName,
    speakerTitle,
    "speakerPhoto": speakerPhoto { ${imageFragment} },
    location,
    tags,
    schedule[] {
      _key,
      startTime,
      endTime,
      speakerName,
      speakerOrganization,
      topics
    }
  }
`)

export const PAST_EVENTS_QUERY = defineQuery(/* groq */ `
  *[_type == "event" && date < now()] | order(date desc) {
    _id,
    title,
    date,
    endDate,
    description,
    "image": image { ${imageFragment} },
    replayUrl,
    speakerName,
    speakerTitle,
    "speakerPhoto": speakerPhoto { ${imageFragment} },
    location,
    tags,
    schedule[] {
      _key,
      startTime,
      endTime,
      speakerName,
      speakerOrganization,
      topics
    },
    replayUrls[] {
      _key,
      replaySessionUrl,
      
    }
  }
`)

// =============================================================================
// BUY PAGE
// =============================================================================

export const BUY_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "buyPage"][0] {
    title,
    headline,
    "flipbookImages": flipbookImages[] {
      ${imageFragment}
    }
  }
`)

// =============================================================================
// HALCYON LISTINGS
// =============================================================================

export const HALCYON_LISTINGS_QUERY = defineQuery(/* groq */ `{
  "available": *[_type == "listing" && isHalcyonProject == true && statusType in ["active", "coming"]] | order(halcyonOrder asc) {
    _id,
    address,
    neighborhood,
    city,
    price,
    beds,
    baths,
    sqft,
    status,
    statusType,
    "image": image { ${imageFragment} },
    brochureUrl,
    units
  },
  "sold": *[_type == "listing" && isHalcyonProject == true && statusType == "sold"] | order(halcyonOrder asc) {
    _id,
    address,
    neighborhood,
    city,
    price,
    beds,
    baths,
    sqft,
    status,
    statusType,
    "image": image { ${imageFragment} },
    brochureUrl,
    units
  }
}`)

export const HALCYON_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "halcyonPage"][0] {
    title,
    "heroLogo": heroLogo { ${imageFragment} },
    heroHeadline,
    aboutHeadline,
    "aboutImage": aboutImage { ${imageFragment} },
    aboutContent,
    quote {
      text,
      attribution
    },
    "aerialImage": aerialImage { ${imageFragment} },
    videoUrl,
    partnerWebsite
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
    heroBio,
    stats[] { display, value, label, description },
    about { sectionLabel, headline, introParagraphs, tagline },
    social[] { platform, url }
  },
  "listings": *[_type == "listing" && featuredOrder != null] | order(order asc) [0...4] {
    _id,
    address,
    neighborhood,
    city,
    price,
    beds,
    baths,
    sqft,
    status,
    statusType,
    units,
    "image": image { ${imageFragment} },
    brochureUrl,
    featured,
    featuredOrder
  },
  "testimonials": *[_type == "testimonial" && pinOnHomePage == true] | order(order asc, _createdAt desc) {
    _id,
    clientName,
    clientTitle,
    date,
    quote
  },
  "agents": *[_type == "agent"] | order(order asc) {
    _id,
    name,
    initials,
    phone,
    email,
    "photo": photo { ${imageFragment} },
    fallbackColor,
    bio {
      summary,
      biography
    }
  }
}`)

// =============================================================================
// SELLING PAGE
// =============================================================================

export const SELLING_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "sellingPage"][0] {
    title,
    heroHeadline,
    heroIntro,
    marketingHeadline,
    marketingIntro,
    marketingTypes,
    "marketingImage": marketingImage { ${imageFragment} },
    marketingGallery[] {
      "image": image { ${imageFragment} },
      alt,
      linkUrl
    },
    propertyPrepHeadline,
    propertyPrepIntro,
    beforeAfterGallery[] {
      name,
      "beforeImage": beforeImage { ${imageFragment} },
      "afterImage": afterImage { ${imageFragment} }
    },
    stagingHeadline,
    stagingIntro,
    stagingPartners[] {
      name,
      description,
      website,
      "logo": logo { ${imageFragment} }
    }
  }
`)

// =============================================================================
// SCHOOL GUIDANCE PAGE
// =============================================================================

export const SCHOOL_GUIDANCE_PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "schoolGuidancePage"][0] {
    title,
    headline,
    "image": image { ${imageFragment} },
    content
  }
`)

// =============================================================================
// NEWSLETTERS
// =============================================================================

// List query - lighter payload for archive page
export const ALL_NEWSLETTERS_QUERY = defineQuery(/* groq */ `
  *[_type == "newsletter" && publishedAt < now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    summary,
    "thumbnail": thumbnail { ${imageFragment} }
  }
`)

// Recent newsletter (published in last 36 hours) for toast notification
export const RECENT_NEWSLETTER_QUERY = defineQuery(/* groq */ `
  *[_type == "newsletter" && publishedAt > $cutoffDate && publishedAt <= now()] | order(publishedAt desc)[0] {
    _id,
    title,
    slug,
    publishedAt
  }
`)

// Single newsletter by slug
export const NEWSLETTER_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "newsletter" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    summary,
    imageSections[] {
      _key,
      heading,
      "image": image { ${imageFragment} },
      alt,
      body,
      moreInfo,
      linkUrl,
      instagram,
      email
    },
    hubspotUrl
  }
`)

// Newsletter by ID for email HTML generation (includes all fields)
export const NEWSLETTER_BY_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "newsletter" && _id == $id][0] {
    _id,
    title,
    slug,
    publishedAt,
    summary,
    imageSections[] {
      _key,
      heading,
      "image": image { ${imageFragment} },
      alt,
      body,
      moreInfo,
      linkUrl,
      instagram
    },
    hubspotUrl
  }
`)

// All newsletters for admin selection (includes drafts)
export const ALL_NEWSLETTERS_ADMIN_QUERY = defineQuery(/* groq */ `
  *[_type == "newsletter"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    slug,
    publishedAt
  }
`)

// =============================================================================
// PRESS
// =============================================================================

export const PRESS_QUERY = defineQuery(/* groq */ `
  *[_type == "press"] | order(order asc, date desc) {
    _id,
    publication,
    "logo": logo { ${imageFragment} },
    "backgroundImage": backgroundImage { ${imageFragment} },
    articleUrl,
    "pdfUrl": pdfFile.asset->url,
    articleTitle,
    date
  }
`)

// =============================================================================
// CLIENT PAGES
// =============================================================================

export const CLIENT_PAGE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "clientPage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    pageTitle,
    markdownContent,
    noIndex
  }
`)
