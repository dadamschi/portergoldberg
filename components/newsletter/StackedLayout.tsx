import type { NewsletterImageSection } from '@/types'
import { SectionHeader } from '@/components'
import { SectionImage } from './SectionImage'
import { SectionContent } from './SectionContent'
import { SectionLinks } from './SectionLinks'

/**
 * Stacked section layout: Image → Title → Content → Links
 * Used for newsletters published on/after July 27, 2026
 */
export function StackedLayout({ sections }: { sections: NewsletterImageSection[] }) {
  return (
    <div className="pg-newsletter-sections-stacked">
      {sections.map((section, index) => (
        <StackedSection
          key={section._key}
          section={section}
          index={index}
        />
      ))}
    </div>
  )
}

function StackedSection({ section, index }: {
  section: NewsletterImageSection
  index: number
}) {
  // Handle both old (string) and new (object) formats
  const linkUrlValue = typeof section.linkUrl === 'string' ? section.linkUrl : section.linkUrl?.url
  const hasLinks = linkUrlValue || section.instagram || section.email || section.facebookHandle || section.phone

  return (
    <div className="pg-newsletter-stacked-section" style={{ marginBottom: 32, maxWidth: 600 }}>
      {/* Title (above image) */}
      {section.heading && (
        <div style={{ marginBottom: 12 }}>
          <SectionHeader heading={section.heading} index={index} titleLarger={section.titleLarger} />
        </div>
      )}

      {/* Image */}
      <div style={{ marginBottom: 12 }}>
        <SectionImage
          image={section.image ?? null}
          alt={section.alt}
          linkUrl={section.linkUrl}
          variant="stacked"
        />
      </div>

      {/* Content */}
      <div style={{ marginBottom: hasLinks ? 8 : 0 }}>
        <SectionContent
          body={section.body}
          moreInfo={section.moreInfo}
          linkUrl={section.linkUrl}
        />
      </div>

      {/* Links */}
      {hasLinks && (
        <div>
          <SectionLinks
            linkUrl={section.linkUrl}
            instagram={section.instagram}
            email={section.email}
            facebookHandle={section.facebookHandle}
            phone={section.phone}
          />
        </div>
      )}
    </div>
  )
}
