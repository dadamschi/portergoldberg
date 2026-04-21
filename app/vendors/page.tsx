import type { Metadata } from 'next'
import { VENDORS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Our Trusted Vendors',
  description: 'A curated list of trusted vendors and service providers recommended by Porter Goldberg Residential.',
}

// Group vendors by category
function groupVendorsByCategory() {
  const grouped: Record<string, typeof VENDORS> = {}

  for (const vendor of VENDORS) {
    if (!grouped[vendor.category]) {
      grouped[vendor.category] = []
    }
    grouped[vendor.category].push(vendor)
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(grouped).sort()
  const sortedGrouped: Record<string, typeof VENDORS> = {}
  for (const category of sortedCategories) {
    sortedGrouped[category] = grouped[category]
  }

  return sortedGrouped
}

export default function VendorsPage() {
  const groupedVendors = groupVendorsByCategory()
  const categories = Object.keys(groupedVendors)

  return (
    <main className="pg-vendors-page">
      <section className="pg-vendors-hero">
        <h1>Our Trusted Vendors</h1>
        <p>
          Over the years, we've built relationships with exceptional service providers across
          Chicago. These are the professionals we trust and recommend to our clients.
        </p>
      </section>

      <section className="pg-vendors-content">
        <nav className="pg-vendors-nav">
          <h3>Categories</h3>
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <a href={`#${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pg-vendors-list">
          {categories.map((category) => (
            <div
              key={category}
              id={category.toLowerCase().replace(/[^a-z0-9]/g, '-')}
              className="pg-vendors-category"
            >
              <h2>{category}</h2>
              <div className="pg-vendors-grid">
                {groupedVendors[category].map((vendor, index) => {
                  const name = [vendor.firstName, vendor.lastName].filter(Boolean).join(' ')
                  return (
                    <div key={index} className="pg-vendor-card">
                      {vendor.company && <h3>{vendor.company}</h3>}
                      {name && <p className="pg-vendor-name">{name}</p>}

                      <div className="pg-vendor-details">
                        {vendor.phone && (
                          <a href={`tel:${vendor.phone.replace(/[^0-9]/g, '')}`} className="pg-vendor-phone">
                            {vendor.phone}
                          </a>
                        )}
                        {vendor.altPhone && (
                          <a href={`tel:${vendor.altPhone.replace(/[^0-9]/g, '')}`} className="pg-vendor-phone pg-vendor-alt">
                            {vendor.altPhone}
                          </a>
                        )}
                        {vendor.email && (
                          <a href={`mailto:${vendor.email}`} className="pg-vendor-email">
                            {vendor.email}
                          </a>
                        )}
                        {vendor.website && (
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="pg-vendor-website">
                            Website
                          </a>
                        )}
                      </div>

                      {(vendor.address || vendor.city) && (
                        <p className="pg-vendor-location">
                          {[vendor.address, vendor.city].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
