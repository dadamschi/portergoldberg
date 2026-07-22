import Image from 'next/image'
import Link from 'next/link'
import { ContactLink } from '@/components'
import { addUtmParams } from '@/lib/utils/utm'
import type { SanityImage } from '@/types'

interface SectionImageProps {
  image: SanityImage | null
  alt?: string
  linkUrl?: string
}

// Enforced aspect ratio: 509x454 (roughly 9:8)
const ASPECT_WIDTH = 509
const ASPECT_HEIGHT = 454

/**
 * Build Sanity image URL with enforced aspect ratio, crop, and hotspot
 * All images are cropped to 509:454 ratio regardless of original dimensions
 */
function getSanityImageUrl(image: SanityImage): string {
  const baseUrl = image.asset.url
  if (!baseUrl.includes('cdn.sanity.io')) return baseUrl

  const params: string[] = [`w=${ASPECT_WIDTH}`, `h=${ASPECT_HEIGHT}`, 'q=80', 'auto=format', 'fit=crop']

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

export function SectionImage({ image, alt, linkUrl }: SectionImageProps) {
  if (!image?.asset?.url) {
    return (<div className="pg-newsletter-card-placeholder">
            <span>YWWT</span>
          </div>
          )
  }

  // Get URL with crop/hotspot applied via Sanity CDN
  const imageUrl = getSanityImageUrl(image)

  const imageElement = (
    <Image
      src={imageUrl}
      alt={alt || 'Newsletter section'}
      width={509}
      height={454}
      className="pg-newsletter-section-image"
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
