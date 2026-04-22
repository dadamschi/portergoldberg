export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Porter Goldberg Residential',
    description: 'Boutique Chicago real estate expertise for buying, selling, and building homes. Samantha Porter & Lauren Goldberg at Jameson Sotheby\'s International Realty.',
    url: 'https://portergoldberg.com',
    logo: 'https://portergoldberg.com/PorterGoldberg-Residential.webp',
    image: 'https://portergoldberg.com/Lauren-and-Samantha-Oval.webp',
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
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
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
          name: 'Porter Goldberg Residential',
        },
      },
      {
        '@type': 'RealEstateAgent',
        name: 'Lauren Goldberg',
        jobTitle: 'Broker',
        worksFor: {
          '@type': 'Organization',
          name: 'Porter Goldberg Residential',
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
    name: 'Porter Goldberg Residential',
    url: 'https://portergoldberg.com',
    description: 'Chicago real estate expertise for buying, selling, and building homes.',
    publisher: {
      '@type': 'Organization',
      name: 'Porter Goldberg Residential',
      logo: {
        '@type': 'ImageObject',
        url: 'https://portergoldberg.com/PorterGoldberg-Residential.webp',
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
