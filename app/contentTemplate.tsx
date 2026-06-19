import { ContentHero } from '@/components/ContentHero'
import { ContactBanner } from '@/components/ContactBanner'

type ContentTemplateProps = {
  title: string
  heroData?: {
    heroHeadline?: string
    heroIntro?: string
  }
  children: React.ReactNode
}

export function ContentTemplate({ title, children, heroData }: ContentTemplateProps) {
  return (
    <>
      <ContentHero title={title} heroHeadline={heroData?.heroHeadline} heroIntro={heroData?.heroIntro} />
      <div className="pg-content">
        {children}
      </div>
    </>
  )
}