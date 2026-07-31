import Image from 'next/image'
import Link from 'next/link'
import { ContactLink } from '@/components'
import { addUtmParams } from '@/lib/utils/utm'
import type { SanityImage } from '@/types'

/**
 * Which newsletter layout the image is rendered in.
 * Each layout has its own enforced aspect ratio, and the value here MUST stay in
 * sync with the matching constant in lib/newsletter-email-template.ts and with
 * .pg-newsletter-section-image in styles/globals.css. If the three disagree, the
 * CDN returns one ratio and the CSS box squashes it into another.
 */
export type SectionImageVariant = 'default' | 'stacked'

interface SectionImageProps {
  image: SanityImage | null
  alt?: string
  linkUrl?: string
  variant?: SectionImageVariant
}

// Enforced aspect ratios, keyed by layout.
// - default (side-by-side, newsletters before 2026-07-27): 509x454 (~1.12:1)
// - stacked (newsletters on/after 2026-07-27):             600x400 (3:2)
const ASPECT: Record<SectionImageVariant, { width: number; height: number }> = {
  default: { width: 600, height: 535 },
  stacked: { width: 600, height: 400 },
}

/**
 * Build Sanity image URL with enforced aspect ratio, crop, and hotspot
 */
function getSanityImageUrl(image: SanityImage, variant: SectionImageVariant): string {
  const baseUrl = image.asset.url
  if (!baseUrl.includes('cdn.sanity.io')) return baseUrl

  const { width, height } = ASPECT[variant]
  const params: string[] = [`w=${width}`, `h=${height}`, 'q=80', 'auto=format', 'fit=crop']

  // Apply manual crop first if set (rect is applied before fit=crop)
  if (image.crop && image.asset.metadata?.dimensions) {
    const { width: origW, height: origH } = image.asset.metadata.dimensions
    const { top, bottom, left, right } = image.crop

    const rectX = Math.round(left * origW)
    const rectY = Math.round(top * origH)
    const rectW = Math.round(origW * (1 - left - right))
    const rectH = Math.round(origH * (1 - top - bottom))

    params.push(`rect=${rectX},${rectY},${rectW},${rectH}`)
  }

  // Use hotspot as focal point for the aspect ratio crop
  if (image.hotspot) {
    params.push('crop=focalpoint', `fp-x=${image.hotspot.x}`, `fp-y=${image.hotspot.y}`)
  } else {
    params.push('crop=center')
  }

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}${params.join('&')}`
}

export function SectionImage({ image, alt, linkUrl, variant = 'default' }: SectionImageProps) {
  if (!image?.asset?.url) {
    return (<div className="pg-newsletter-card-placeholder">
            <span>YWWT</span>
          </div>
          )
  }

  // Get URL with crop/hotspot applied via Sanity CDN
  const imageUrl = getSanityImageUrl(image, variant)
  const { width, height } = ASPECT[variant]

  const imageElement = (
    <Image
      src={imageUrl}
      alt={alt || 'Newsletter section'}
      width={width}
      height={height}
      className={`pg-newsletter-section-image pg-newsletter-section-image--${variant}`}
      style={{ border: 0, display: 'block', height: 'auto', width: '100%', maxWidth: 600 }}
    />
  )

  if (!linkUrl) {
    return imageElement
  }

  if (linkUrl.startsWith('#contact:')) {
    const message = linkUrl.replace('#contact:', '')
    return (
      <ContactLink message={message} className="pg-newsletter-section-link">
        {imageElement}
      </ContactLink>
    )
  }

  if (linkUrl.startsWith('/')) {
    return (
      <Link href={linkUrl} className="pg-newsletter-section-link">
        {imageElement}
      </Link>
    )
  }

  return (
    <a
      href={addUtmParams(linkUrl, { campaign: 'newsletter' })}
      target="_blank"
      rel="noreferrer"
      className="pg-newsletter-section-link"
    >
      {imageElement}
    </a>
  )
}
