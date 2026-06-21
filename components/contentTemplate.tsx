import { ContentHero } from '@/components/ContentHero'
import { LocalBusinessJsonLd, WebsiteJsonLd } from '@/components/JsonLd'

type HeroImage = {
  src: string
  alt: string
  width: number
  height: number
}

type ContentTemplateProps = {
  title?: string
  heroData?: {
    heroHeadline?: string
    heroIntro?: string
    heroTitle?: string
    heroImage?: HeroImage
  }
  children: React.ReactNode
}

export function ContentTemplate({ title, children, heroData }: ContentTemplateProps) {
  return (
    <>
      <LocalBusinessJsonLd />
      <WebsiteJsonLd />
      <ContentHero
        title={title}
        heroHeadline={heroData?.heroHeadline}
        heroIntro={heroData?.heroIntro}
        heroImage={heroData?.heroImage}
      />
      <div className="pg-content">
        {children}
      </div>
    </>
  )
}