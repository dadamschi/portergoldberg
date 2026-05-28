const SITE_URL = 'https://www.portergoldberg.com'

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
    email: 'info@portergoldberg.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '425 W. North Avenue',
      addressLocality: 'Chicago',
      addressRegion: 'IL',
      postalCode: '60610',
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
