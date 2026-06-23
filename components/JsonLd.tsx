import type { EventItem } from '@/types'
import { toPlainText } from '@/lib/utils/text'
import { SITE_URL, EMAIL_INFO, BUSINESS_INFO } from '@/lib/constants'

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'PorterGoldberg Residential',
    description: 'Boutique Chicago real estate expertise for buying, selling, and building homes. Samantha Porter & Lauren Goldberg at Jameson Sotheby\'s International Realty.',
    url: SITE_URL,
    logo: `${SITE_URL}/PorterGoldberg-Residential.webp`,
    image: `${SITE_URL}/Lauren-and-Samantha-Oval.webp`,
    telephone: '+1-312-944-8900',
    email: EMAIL_INFO,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address,
      addressLocality: BUSINESS_INFO.city,
      addressRegion: BUSINESS_INFO.state,
      postalCode: BUSINESS_INFO.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.9103,
      longitude: -87.6390,
    },
    areaServed: {
      '@type': 'City',
      name: 'Chicago',
      sameAs: 'https://en.wikipedia.org/wiki/Chicago',
    },
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.instagram.com/portergoldberg/',
      'https://www.linkedin.com/company/porter-goldberg-residential/',
    ],
    parentOrganization: {
      '@type': 'RealEstateAgent',
      name: 'Jameson Sotheby\'s International Realty',
      url: 'https://www.jamesonsir.com/',
    },
    employee: [
      {
        '@type': 'RealEstateAgent',
        name: 'Samantha Porter',
        jobTitle: 'Broker',
        worksFor: {
          '@type': 'Organization',
          name: 'PorterGoldberg Residential',
        },
      },
      {
        '@type': 'RealEstateAgent',
        name: 'Lauren Goldberg',
        jobTitle: 'Broker',
        worksFor: {
          '@type': 'Organization',
          name: 'PorterGoldberg Residential',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PorterGoldberg Residential',
    url: SITE_URL,
    description: 'Chicago real estate expertise for buying, selling, and building homes.',
    publisher: {
      '@type': 'Organization',
      name: 'PorterGoldberg Residential',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/PorterGoldberg-Residential.webp`,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

type FAQItem = {
  question: string
  answer: string
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function EventsJsonLd({ events }: { events: EventItem[] }) {
  const eventSchemas = events.map((event) => ({
    '@type': 'Event',
    name: event.title,
    description: toPlainText(event.description),
    startDate: event.date,
    endDate: event.endDate || event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.location
      ? 'https://schema.org/OfflineEventAttendanceMode'
      : 'https://schema.org/OnlineEventAttendanceMode',
    location: event.location
      ? {
          '@type': 'Place',
          name: event.location,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Chicago',
            addressRegion: 'IL',
          },
        }
      : {
          '@type': 'VirtualLocation',
          url: event.registrationUrl || `${SITE_URL}/events`,
        },
    organizer: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    image: event.image?.asset?.url,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': eventSchemas,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
