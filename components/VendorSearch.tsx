'use client'

import { useState, useMemo } from 'react'
import type { HubSpotVendor } from '@/lib/hubspot'
import { addUtmParams } from '@/lib/utils/utm'

type Vendor = HubSpotVendor

interface VendorSearchProps {
  vendors: Vendor[]
}

// Group vendors by category
function groupVendorsByCategory(vendors: Vendor[]) {
  const grouped: Record<string, Vendor[]> = {}

  for (const vendor of vendors) {
    if (!grouped[vendor.category]) {
      grouped[vendor.category] = []
    }
    grouped[vendor.category].push(vendor)
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(grouped).sort()
  const sortedGrouped: Record<string, Vendor[]> = {}
  for (const category of sortedCategories) {
    sortedGrouped[category] = grouped[category]
  }

  return sortedGrouped
}

export function VendorSearch({ vendors }: VendorSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter vendors based on search query
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) {
      return vendors
    }

    const query = searchQuery.toLowerCase().trim()
    return vendors.filter((vendor) => {
      const searchableFields = [
        vendor.company,
        vendor.firstName,
        vendor.lastName,
        vendor.category,
        vendor.city,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableFields.includes(query)
    })
  }, [vendors, searchQuery])

  const groupedVendors = useMemo(
    () => groupVendorsByCategory(filteredVendors),
    [filteredVendors]
  )
  const categories = Object.keys(groupedVendors)
  const allCategories = useMemo(
    () => Object.keys(groupVendorsByCategory(vendors)),
    [vendors]
  )

  const isSearching = searchQuery.trim().length > 0

  return (
    <>
      {/* Search Input - Sticky on mobile */}
      <div className="pg-vendors-search">
        <div className="pg-vendors-search-input-wrapper">
          <svg
            className="pg-vendors-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search vendors by name, company, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pg-vendors-search-input"
            aria-label="Search vendors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="pg-vendors-search-clear"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {isSearching && (
          <p className="pg-vendors-search-results">
            {filteredVendors.length === 0
              ? 'No vendors found'
              : `${filteredVendors.length} vendor${filteredVendors.length === 1 ? '' : 's'} found`}
          </p>
        )}
      </div>

      <section className="pg-vendors-content">
        {/* Category Navigation - only show when not searching */}
        {!isSearching && (
          <nav className="pg-vendors-nav" id="vendor-categories">
            <details className="pg-vendors-nav-mobile">
              <summary>
                <span>Categories</span>
                <span className="pg-vendors-nav-count">{allCategories.length}</span>
              </summary>
              <ul>
                {allCategories.map((category) => (
                  <li key={category}>
                    <a href={`#${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
            <div className="pg-vendors-nav-desktop">
              <h3>Categories</h3>
              <ul>
                {allCategories.map((category) => (
                  <li key={category}>
                    <a href={`#${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        {!isSearching && (
          <a href="#vendor-categories" className="pg-vendors-back-btn" aria-label="Back to categories">
            ↑ Categories
          </a>
        )}

        <div className={`pg-vendors-list ${isSearching ? 'pg-vendors-list--searching' : ''}`}>
          {categories.length === 0 ? (
            <div className="pg-vendors-empty">
              <p>No vendors match your search.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="pg-vendors-empty-clear"
              >
                Clear search
              </button>
            </div>
          ) : (
            categories.map((category) => (
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
                            <a
                              href={`tel:${vendor.phone.replace(/[^0-9]/g, '')}`}
                              className="pg-vendor-phone"
                            >
                              {vendor.phone}
                            </a>
                          )}
                          {vendor.email && (
                            <a href={`mailto:${vendor.email}`} className="pg-vendor-email">
                              {vendor.email}
                            </a>
                          )}
                          {vendor.website && (
                            <a
                              href={addUtmParams(vendor.website, { campaign: 'vendor-referral' })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pg-vendor-website"
                            >
                              Website
                            </a>
                          )}
                        </div>

                        {!vendor.isPersonalContact && (vendor.address || vendor.city) && (
                          <p className="pg-vendor-location">
                            {[vendor.address, vendor.city].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
