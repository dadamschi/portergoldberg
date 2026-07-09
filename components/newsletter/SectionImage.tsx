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

export function SectionImage({ image, alt, linkUrl }: SectionImageProps) {
  if (!image?.asset?.url) {
    return null
  }

  const imageElement = (
    <Image
      src={image.asset.url}
      alt={alt || 'Newsletter section'}
      width={508}
      height={454}
      className="pg-newsletter-section-image"
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
