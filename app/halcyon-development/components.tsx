'use client'

import { ImageLightbox } from '@/components/ImageLightbox'
import type { Listing } from '@/types'

type HalcyonSoldProjectsProps = {
  listings: Listing[]
}

export function HalcyonSoldProjects({ listings }: HalcyonSoldProjectsProps) {
  return (
      <div className="pg-halcyon-projects-grid">
        {listings.map((listing) => {
          const imageUrl = listing.image?.asset?.url || '/COMING-SOON.png'

          return (
            <div key={listing._id} className="pg-halcyon-project-card">
              <ImageLightbox src={imageUrl} alt={listing.address}>
                {/* {listing.units && (
                  <div className="pg-halcyon-units">{listing.units}</div>
                )} */}
                <div className="pg-halcyon-project-image">
                  <img src={imageUrl} alt={listing.address} />
                </div>
              </ImageLightbox>
              <p className="pg-halcyon-project-address">{listing.address}</p>
            </div>
          )
        })}
      </div>
  )
}
