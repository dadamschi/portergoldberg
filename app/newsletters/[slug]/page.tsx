import type { Metadata } from 'next'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { Newsletter, NewsletterImageSection, NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { NEWSLETTER_BY_SLUG_QUERY, ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import { formatDateOnly } from '@/lib/utils/dateTime'
import Link from 'next/link'
import { SectionHeader, NewsletterDownloadButton } from '@/components'
import { SectionImage } from '@/components/newsletter/SectionImage'
import { SectionContent } from '@/components/newsletter/SectionContent'
import { SectionLinks } from '@/components/newsletter/SectionLinks'
import type { NewsletterSection } from '@/lib/newsletter-email-template'

export const revalidate = 2592000 // 1 month - webhook handles on-demand revalidation

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string; layout?: string }>
}

// Cached to deduplicate requests between generateMetadata and page component
const getNewsletter = cache(async (slug: string, preview = false): Promise<Newsletter | null> => {
  if (preview) {
    // Skip Next.js cache for preview requests
    return client.fetch<Newsletter | null>(
      NEWSLETTER_BY_SLUG_QUERY,
      { slug },
      { perspective: 'previewDrafts', next: { revalidate: 0 } }
    )
  }
  return client.fetch<Newsletter | null>(NEWSLETTER_BY_SLUG_QUERY, { slug })
})

const getAllNewsletters = cache(async (): Promise<NewsletterPreview[]> => {
  return client.fetch<NewsletterPreview[]>(ALL_NEWSLETTERS_QUERY)
})

export async function generateStaticParams() {
  const newsletters = await client.fetch<{ slug: string }[]>(
    `*[_type == "newsletter"]{ "slug": slug.current }`
  )
  return newsletters.map((newsletter) => ({ slug: newsletter.slug }))
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const newsletter = await getNewsletter(slug)
  console.log('newsletter', newsletter)

  if (!newsletter) {
    return { title: 'Newsletter Not Found' }
  }

  const url = `https://www.portergoldberg.com/newsletters/${slug}`

  return {
    title: `${newsletter.title} | ${formatDateOnly(newsletter.publishedAt)}`,
    description: newsletter.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${newsletter.title} | ${formatDateOnly(newsletter.publishedAt)}`,
      description: newsletter.summary,
      url,
      type: 'article',
      publishedTime: newsletter.publishedAt,
      authors: ['PorterGoldberg Residential'],
      siteName: 'PorterGoldberg Residential',
    },
    twitter: {
      card: 'summary',
      title: newsletter.title,
      description: newsletter.summary,
    },
  }
}

/**
 * Original side-by-side layout with alternating image position
 */
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

/**
 * Stacked section layout: Image → Title → Content → Links
 * Use with ?layout=stacked query param
 */
function StackedSection({ section, index }: {
  section: NewsletterImageSection
  index: number
}) {
  const hasLinks = section.linkUrl || section.instagram || section.email || section.facebookHandle

  return (
    <div className="pg-newsletter-stacked-section" style={{ marginBottom: 32, maxWidth: 600 }}>
      {/* Image */}
      <div style={{ marginBottom: 12 }}>
        <SectionImage
          image={section.image ?? null}
          alt={section.alt}
          linkUrl={section.linkUrl}
        />
      </div>

      {/* Title (under image) */}
      {section.heading && (
        <div style={{ marginBottom: 12 }}>
          <SectionHeader heading={section.heading} index={index} titleLarger={section.titleLarger} />
        </div>
      )}

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
          />
        </div>
      )}
    </div>
  )
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { preview, layout } = await searchParams
  const isPreview = preview === 'true'
  const isStacked = layout === 'stacked'

  const [newsletter, allNewsletters] = await Promise.all([
    getNewsletter(slug, isPreview),
    getAllNewsletters()
  ])

  if (isPreview) {
    console.log('[Newsletter] Preview mode enabled for newsletter:', slug)
    console.log('[Newsletter] Preview mode enabled for newsletter:', newsletter)
  }

  if (!newsletter) {
    redirect('/newsletters')
  }

  // Filter out current newsletter from sidebar list
  const otherNewsletters = allNewsletters.filter(
    (n) => n.slug.current !== slug
  )

  // Map Sanity sections to email template format for download
  const emailSections: NewsletterSection[] = (newsletter.imageSections ?? []).map((s) => ({
    heading: s.heading ?? '',
    imageUrl: s.image?.asset?.url ?? '',
    imageAlt: s.alt,
    imageHotspot: s.image?.hotspot,
    imageCrop: s.image?.crop,
    imageDimensions: s.image?.asset?.metadata?.dimensions,
    body: s.body ?? '',
    caption: s.moreInfo ?? '',
    linkUrl: s.linkUrl,
    instagram: s.instagram,
    titleLarger: s.titleLarger,
    facebookHandle: s.facebookHandle
  }))

  return (
    <main className="pg-page">
      {isPreview && (
        <div className="pg-preview-banner">
          <span>Preview Mode — This is a draft</span>
          <NewsletterDownloadButton
            sections={emailSections}
            slug={slug}
            filename={`newsletter-${slug}.html`}
          />
        </div>
      )}
      <section className="pg-newsletter-detail-section">
        <div className="pg-newsletter-detail-layout">
          <div className="pg-newsletter-detail-main">
            <Link href="/newsletters" className="pg-newsletter-back-link">
              ← Back to Newsletter Archive
            </Link>

            <article className="pg-newsletter-detail">
              <header className="pg-newsletter-detail-header">
                <time className="pg-newsletter-date" dateTime={newsletter.publishedAt}>
                  {formatDateOnly(newsletter.publishedAt)}
                </time>
                <h1 className="pg-newsletter-detail-title">{newsletter.title}</h1>
              </header>

              {/* Image sections - toggle between stacked (?layout=stacked) and side-by-side */}
              {newsletter.imageSections && newsletter.imageSections.length > 0 && (
                isStacked ? (
                  <div className="pg-newsletter-sections-stacked">
                    {newsletter.imageSections.map((section, index) => (
                      <StackedSection
                        key={section._key}
                        section={section}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <table className="pg-newsletter-table">
                    <tbody>
                      {newsletter.imageSections.map((section, index) => {
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
              )}
            </article>
          </div>

          {otherNewsletters.length > 0 && (
            <aside className="pg-newsletter-sidebar">
              <h2 className="pg-newsletter-sidebar-title">Newsletter Archive</h2>
              <ul className="pg-newsletter-sidebar-list">
                {otherNewsletters.map((item) => (
                  <li key={item._id} className="pg-newsletter-sidebar-item">
                    <Link
                      href={`/newsletters/${item.slug.current}`}
                      className="pg-newsletter-sidebar-link"
                    >
                      <span className="pg-newsletter-sidebar-date">
                        {formatDateOnly(item.publishedAt)}
                      </span>
                      {/* <span className="pg-newsletter-sidebar-name">{item.title}</span> */}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/newsletters" className="pg-newsletter-url-link" style={{ fontWeight: '500' }}>
                ← View All Newsletters
              </Link>
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
