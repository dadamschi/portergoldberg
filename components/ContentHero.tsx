'use client'
import Image from 'next/image'

type ImageProps = {
  src: string
  alt: string
  width: number
  height: number
  style?: React.CSSProperties
  priority?: boolean
  unoptimized?: boolean
}

type ContentHeroProps = {
  title?: string
  heroHeadline?: string
  heroIntro?: string
  heroImage?: ImageProps
}

export function ContentHero({ title, heroHeadline, heroIntro, heroImage }: ContentHeroProps) {
  return (
    <section className="pg-page-hero">
      {heroImage ? (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            className="pg-hero-logo"
            style={heroImage.style}
            priority={heroImage.priority}
            unoptimized={heroImage.unoptimized}
          />
        ) : (
          <h1>{title}</h1>
        )}
      {heroHeadline && <p>{heroHeadline}</p>}
      {heroIntro && <p>{heroIntro}</p>}
    </section>
  )
}
