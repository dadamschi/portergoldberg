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
  underContract: 'pg-listing-status--active',
}

type ListingCardProps = {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isActive, setIsActive] = useState(false)
  const { address, neighborhood, city, price, beds, baths, sqft, status, statusType, image, brochureUrl, units } = listing

  const statusText = status ?? statusType
  const contactMessage = `I'm interested in the property at ${address}, ${neighborhood}.`
  const finalPrice = price ?? 'Inquire for pricing'

  // Build amenities string (e.g., "6 Beds | 5/1 Baths | 25,000 ft²")
  const amenities = [
    beds ? `${beds} Bed${beds !== '1' ? 's' : ''}` : null,
    baths ? `${baths} Bath${baths !== '1' ? 's' : ''}` : null,
    (units && units >= 2) ? `${units} Unit${units !== 1 ? 's' : ''}` : null,
    sqft,
  ].filter(Boolean).join(' | ')

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
            <div className="pg-listing-placeholder">
              <span>Coming Soon</span>
            </div>
          )}
          {statusType !== 'coming' && (
            <span className={`pg-listing-status ${STATUS_CLASS[statusType]}`}>
              {statusText}
            </span>
          )}
          {/* {units && (
            <span className="pg-listing-units">
              {units} Unit{units !== 1 ? 's' : ''}
            </span>
          )} */}
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
            onClick={() => openContactForm(contactMessage, address)}
            className="pg-listing-btn pg-listing-btn--contact"
          >
            Inquire
          </button>
        </div>
      </div>
      <div className="pg-listing-info">
        <div className="pg-listing-price">{finalPrice || '\u00A0'}</div>
        {amenities && (
          <div className="pg-listing-amenities">{amenities || '\u00A0'}</div>
        )}
        <div className="pg-listing-address">{address}, {city || 'Chicago'}</div>
      </div>
    </div>
  )
}
