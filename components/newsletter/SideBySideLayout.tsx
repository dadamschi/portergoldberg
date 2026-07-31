import type { NewsletterImageSection } from '@/types'
import { SectionHeader } from '@/components'
import { SectionImage } from './SectionImage'
import { SectionContent } from './SectionContent'
import { SectionLinks } from './SectionLinks'

/**
 * Original side-by-side layout with alternating image position
 * Used for newsletters published before July 27, 2026
 */
export function SideBySideLayout({ sections }: { sections: NewsletterImageSection[] }) {
  return (
    <table className="pg-newsletter-table">
      <tbody>
        {sections.map((section, index) => {
          const isImageRight = index % 2 === 1
          return (
            <SectionRows
              key={section._key}
              section={section}
              index={index}
              isImageRight={isImageRight}
            />
          )
        })}
      </tbody>
    </table>
  )
}

function SectionRows({ section, index, isImageRight }: {
  section: NewsletterImageSection
  index: number
  isImageRight: boolean
}) {
  const image = (
    <SectionImage
      image={section.image ?? null}
      alt={section.alt}
      linkUrl={section.linkUrl}
    />
  )

  const content = (
    <SectionContent
      body={section.body}
      moreInfo={section.moreInfo}
      linkUrl={section.linkUrl}
    />
  )

  const links = (
    <SectionLinks
      linkUrl={section.linkUrl}
      instagram={section.instagram}
      email={section.email}
      facebookHandle={section.facebookHandle}
    />
  )

  const hasLinks = section.linkUrl || section.instagram || section.email || section.facebookHandle

  return (
    <>
      {section.heading && (
        <tr className="pg-newsletter-row pg-newsletter-row--heading">
          <td colSpan={2}>
            <SectionHeader heading={section.heading} index={index} titleLarger={section.titleLarger} />
          </td>
        </tr>
      )}

      <tr className="pg-newsletter-row pg-newsletter-row">
        {isImageRight ? (
          <>
            <td className="pg-newsletter-cell pg-newsletter-cell--content-left">{content}</td>
            <td className="pg-newsletter-cell pg-newsletter-cell--image-right">{image}</td>
          </>
        ) : (
          <>
            <td className="pg-newsletter-cell pg-newsletter-cell--image-left">{image}</td>
            <td className="pg-newsletter-cell pg-newsletter-cell--content-right">{content}</td>
          </>
        )}
      </tr>

      {hasLinks ? (
        <tr className="pg-newsletter-row pg-newsletter-row--links">
          {isImageRight ? (
            <>
              <td width="5%"></td>
              <td>{links}</td>
            </>
          ) : (
            <>
              <td colSpan={2}>{links}</td>
            </>
          )}
        </tr>
      ) : (
        <tr className="pg-newsletter-row pg-newsletter-row--heading">
          <td colSpan={2} className="pg-newsletter-cell pg-newsletter-cell--empty">&nbsp;</td>
        </tr>
      )}
    </>
  )
}
