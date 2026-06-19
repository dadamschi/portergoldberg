'use client'

type ContentHeroProps = {
  title?: string
  heroHeadline?: string
  heroIntro?: string
}

export function ContentHero({ title, heroHeadline, heroIntro }: ContentHeroProps) {
  return (
    <section className="pg-page-hero">
      <h1>{title}</h1>
      {heroHeadline && <p>{heroHeadline}</p>}
      {heroIntro && <p>{heroIntro}</p>}
    </section>
  )
}
