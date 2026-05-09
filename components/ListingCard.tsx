import Image from 'next/image'
import type { Listing } from '@/types'
import { addUtmParams } from '@/lib/utils/utm'

const STATUS_CLASS: Record<string, string> = {
  active: 'pg-listing-status--active',
  coming: 'pg-listing-status--coming',
  sold: 'pg-listing-status--sold',
}

type ListingCardProps = {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { address, neighborhood, price, status, statusType, image, brochureUrl } = listing

  const Tag = brochureUrl ? 'a' : 'div'
  const statusText = status ?? statusType
  const href = brochureUrl ? addUtmParams(brochureUrl, { campaign: 'listing-brochure' }) : undefined

  return (
    <Tag
      href={href}
      target={brochureUrl ? '_blank' : undefined}
      rel={brochureUrl ? 'noreferrer' : undefined}
      className="pg-listing-card"
    >
      <div className="pg-listing-bg">
        {image?.asset?.url ? (
          <Image
            src={`${image.asset.url}?w=800&q=100`}
            alt={address}
            fill
            sizes="400px"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        ) : (
          <Image
            src="/COMING-SOON.png"
            alt="Coming Soon"
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <span className={`pg-listing-status ${STATUS_CLASS[statusType]}`}>
        {statusText}
      </span>
      <div className="pg-listing-inner">
        <div className="pg-listing-price">{price}</div>
        <div className="pg-listing-address">{address}</div>
        <div className="pg-listing-address">{neighborhood}</div>
      </div>
    </Tag>
  )
}
