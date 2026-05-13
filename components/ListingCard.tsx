'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Listing } from '@/types'
import { addUtmParams } from '@/lib/utils/utm'
import { openContactForm } from '@/lib/utils/contact'

const STATUS_CLASS: Record<string, string> = {
  active: 'pg-listing-status--active',
  coming: 'pg-listing-status--coming',
  sold: 'pg-listing-status--sold',
}

type ListingCardProps = {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isActive, setIsActive] = useState(false)
  const { address, neighborhood, price, beds, baths, sqft, status, statusType, image, brochureUrl } = listing

  const statusText = status ?? statusType
  const contactMessage = `I'm interested in the property at ${address}, ${neighborhood}.`

  // Build amenities string (e.g., "6 Beds  5/1 Baths  25,000 ft²")
  const amenities = [
    beds ? `${beds} Bed${beds !== 1 ? 's' : ''}` : null,
    baths ? `${baths} Bath${baths !== '1' ? 's' : ''}` : null,
    sqft,
  ].filter(Boolean).join('  \u00A0\u00A0')

  const handleCardClick = (e: React.MouseEvent) => {
    // Only toggle on touch devices (no hover capability)
    if (window.matchMedia('(hover: none)').matches) {
      // Don't toggle if clicking on a button or link
      if ((e.target as HTMLElement).closest('a, button')) {
        return
      }
      setIsActive(!isActive)
    }
  }

  return (
    <div
      className={`pg-listing-card ${isActive ? 'pg-listing-card--active' : ''}`}
      onClick={handleCardClick}
    >
      <div className="pg-listing-image-wrapper">
        <div className="pg-listing-image">
          {image?.asset?.url ? (
            <Image
              src={`${image.asset.url}`}
              alt={image.alt || `${address}, ${neighborhood} - ${statusText}`}
              fill
              sizes="400px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Image
              src="/COMING-SOON.png"
              alt="Coming Soon"
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
          <span className={`pg-listing-status ${STATUS_CLASS[statusType]}`}>
            {statusText}
          </span>
        </div>
        <div className="pg-listing-actions">
          {brochureUrl && (
            <a
              href={addUtmParams(brochureUrl, { campaign: 'listing-brochure' })}
              target="_blank"
              rel="noreferrer"
              className="pg-listing-btn"
            >
              View Brochure
            </a>
          )}
          <button
            type="button"
            onClick={() => openContactForm(contactMessage)}
            className="pg-listing-btn pg-listing-btn--contact"
          >
            Inquire
          </button>
        </div>
      </div>
      <div className="pg-listing-info">
        {price && <div className="pg-listing-price">{price}</div>}
        {amenities && <div className="pg-listing-amenities">{amenities}</div>}
        <div className="pg-listing-address">{address}, {neighborhood}</div>
      </div>
    </div>
  )
}
