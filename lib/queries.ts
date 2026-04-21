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
          status,                                                
          statusType,                                            
          "image": image { ${imageFragment} },                   
          brochureUrl                                            
        },                                                       
    "sold": *[_type == "listing" && statusType == "sold"] |  
      order(order asc) {                                         
          _id,                                                   
          address,                                               
          neighborhood,                                          
          price,                                                 
          status,                                                
          statusType,                                            
          "image": image { ${imageFragment} },                   
          brochureUrl                                            
        }                                                        
  }                                                          
  `) 

// =============================================================================
// TESTIMONIALS
// =============================================================================

export const ALL_TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    clientName,
    clientTitle,
    quote,
    pinOnHomePage
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
    bio {
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
    brochureUrl
  },
  "testimonials": *[_type == "testimonial" && pinOnHomePage == true] | order(_createdAt desc) {
    _id,
    clientName,
    clientTitle,
    quote
  } + *[_type == "testimonial" && pinOnHomePage != true] | order(_createdAt desc) [0...4] {
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
    fallbackColor,
    bio {
      summary,
      biography
    }
  }
}`)
