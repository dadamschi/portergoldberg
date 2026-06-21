'use client'
import Image from 'next/image'

type ContentHeroProps = {
  title?: string
  heroHeadline?: string
  heroIntro?: string
  heroImage?: {
      src: string
      alt: string
      width: number
      height: number
    }
}

export function ContentHero({ title, heroHeadline, heroIntro, heroImage }: ContentHeroProps) {
  console.log(heroImage)
  return (
    <section className="pg-page-hero">
      {heroImage ? (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            className="pg-hero-logo"
          />
        ) : (
          <h1>{title}</h1>
        )}
      {heroHeadline && <p>{heroHeadline}</p>}
      {heroIntro && <p>{heroIntro}</p>}
    </section>
  )
}
