import type { Listing } from '@/types'

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

  const bgStyle = image?.asset?.url
    ? { backgroundImage: `url(${image.asset.url})` }
    : { backgroundImage: `url('/coming-soon.png')` }

  const Tag = brochureUrl ? 'a' : 'div'

  const statusText = status ?? statusType

  return (
    <Tag
      href={brochureUrl ?? undefined}
      target={brochureUrl ? '_blank' : undefined}
      rel={brochureUrl ? 'noreferrer' : undefined}
      className="pg-listing-card"
    >
      <div className="pg-listing-bg" style={bgStyle} />
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
