import type { Metadata } from 'next'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { Newsletter, NewsletterImageSection, NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { NEWSLETTER_BY_SLUG_QUERY, ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import { formatDateOnly } from '@/lib/utils/dateTime'
import { addUtmParams } from '@/lib/utils/utm'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader, ContactLink, NewsletterDownloadButton } from '@/components'
import type { NewsletterSection } from '@/lib/newsletter-email-template'

export const revalidate = 2592000 // 1 month - webhook handles on-demand revalidation

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
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

function ImageSection({ section, index }: { section: NewsletterImageSection; index: number }) {
  const hasImage = section.image?.asset?.url
  const hasBody = section.body || section.moreInfo
  const isImageRight = index % 2 === 1

  // Build image element if we have an image
  const imageElement = hasImage ? (
    <Image
      src={section.image!.asset.url}
      alt={section.alt || 'Newsletter section'}
      width={600}
      height={400}
      className="pg-newsletter-section-image"
      style={{ width: '100%', height: 'auto' }}
    />
  ) : null

  // Wrap image with link if provided
  let linkedImage = imageElement
  if (imageElement && section.linkUrl) {
    if (section.linkUrl.startsWith('#contact:')) {
      const message = section.linkUrl.replace('#contact:', '')
      linkedImage = (
        <ContactLink message={message} className="pg-newsletter-section-link">
          {imageElement}
        </ContactLink>
      )
    } else if (section.linkUrl.startsWith('/')) {
      linkedImage = (
        <Link href={section.linkUrl} className="pg-newsletter-section-link">
          {imageElement}
        </Link>
      )
    } else {
      linkedImage = (
        <a
          href={addUtmParams(section.linkUrl, { campaign: 'newsletter' })}
          target="_blank"
          rel="noreferrer"
          className="pg-newsletter-section-link"
        >
          {imageElement}
        </a>
      )
    }
  }

  // Render Instagram handle as clickable link if present
  const instagramHandle = section.instagram?.replace('@', '')
  const instagramLink = instagramHandle ? (
    <a
      href={addUtmParams(`https://instagram.com/${instagramHandle}`, { campaign: 'newsletter' })}
      target="_blank"
      rel="noreferrer"
      className="pg-newsletter-instagram-link"
    >
      @{instagramHandle}
    </a>
  ) : null
    // Build URL link element (only for regular links, not #contact: or mailto:)
  const isRegularLink = section.linkUrl &&
    !section.linkUrl.startsWith('#contact:') &&
    !section.linkUrl.startsWith('mailto:')

  const isLocalLink = section.linkUrl && (
    section.linkUrl.startsWith('/') ||
    section.linkUrl.includes('portergoldberg.com')
  )

  // Build the URL link element
  let urlLink: React.ReactNode = null
  if (isRegularLink) {
    if (isLocalLink) {
      const localPath = section.linkUrl!.startsWith('/')
        ? section.linkUrl!
        : new URL(section.linkUrl!).pathname
      
      const pathMap: Record<string, string> = {
        '/': '',
        '/about': 'About',
        '/selling': 'Selling',
        '/buying': 'Checkout out the Buying Process',
        '/vendors': 'Checkout our Vendors',
      }

      const linkText = pathMap[localPath] ?? 'Learn More'

      urlLink = (
        <Link href={localPath} className="pg-newsletter-url-link">
          {linkText}
        </Link>
      )
    } else {
      // Check if it's a Jameson property brochure
      const isBrochure = section.linkUrl!.includes('jamesonps.com')
      const linkText = isBrochure ? 'Check out the property brochure' : section.linkUrl

      urlLink = (
        <a
          href={addUtmParams(section.linkUrl!, { campaign: 'newsletter' })}
          target="_blank"
          rel="noreferrer"
          className="pg-newsletter-url-link"
        >
          {linkText}
        </a>
      )
    }
  }

  // Stack URL link and Instagram link together
  const sectionLinks = (urlLink || instagramLink) ? (
    <div className="pg-newsletter-section-links">
      {urlLink}
      {instagramLink}
    </div>
  ) : null

  // Text content block (only when body text exists)
  const textBlock = hasBody ? (
    <div className="pg-newsletter-section-text">
      {section.body && <p className="pg-newsletter-section-body">{section.body}</p>}
      {section.moreInfo && <p className="pg-newsletter-section-more-info">{section.moreInfo}</p>}
    </div>
  ) : null

  // Wrap text with link if provided (no decorations)
  const linkStyle = { textDecoration: 'none', color: 'inherit' }
  let textContent = textBlock
  if (textBlock && section.linkUrl) {
    if (section.linkUrl.startsWith('#contact:')) {
      const message = section.linkUrl.replace('#contact:', '')
      textContent = (
        <ContactLink message={message} style={linkStyle}>
          {textBlock}
        </ContactLink>
      )
    } else if (section.linkUrl.startsWith('/')) {
      textContent = (
        <Link href={section.linkUrl} style={linkStyle}>
          {textBlock}
        </Link>
      )
    } else {
      textContent = (
        <a
          href={addUtmParams(section.linkUrl, { campaign: 'newsletter' })}
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          {textBlock}
        </a>
      )
    }
  }

  // IMAGE ONLY (no body text): Simple layout - just image + links
  if (!hasBody) {
    return (
      <>
        {linkedImage}
        {sectionLinks}
      </>
    )
  }

  // IMAGE + BODY TEXT: Two-column layout
  if (hasImage && hasBody) {
    return (
      <div className={`pg-newsletter-section-layout ${isImageRight ? 'pg-newsletter-section-layout--right' : ''}`}>
        <div className="pg-newsletter-section-media">
          {linkedImage}
          {sectionLinks}
        </div>
        <div className="pg-newsletter-section-content">
          {textContent}
        </div>
      </div>
    )
  }

  // TEXT ONLY (no image): Just render text content
  return (
    <>
      {textContent}
      {sectionLinks}
    </>
  )
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'

  const [newsletter, allNewsletters] = await Promise.all([
    getNewsletter(slug, isPreview),
    getAllNewsletters()
  ])

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
    layout: s.layout ?? 'image-left',
    imageUrl: s.image?.asset?.url ?? '',
    imageAlt: s.alt,
    body: s.body ?? '',
    caption: [s.moreInfo, s.instagram ? `@${s.instagram.replace('@', '')}` : ''].filter(Boolean).join('\n'),
    linkUrl: s.linkUrl,
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

              {/* Image sections - the visual newsletter */}
              {newsletter.imageSections && newsletter.imageSections.length > 0 && (
                <div className="pg-newsletter-images">
                  {newsletter.imageSections.map((section, index) => (
                    <div key={section._key} className="pg-newsletter-section">
                      {section.heading && <SectionHeader heading={section.heading} index={index} />}
                      <ImageSection section={section} index={index} />
                    </div>
                  ))}
                </div>
              )}

              {newsletter.hubspotUrl && (
                <div className="pg-newsletter-external">
                  <a
                    href={addUtmParams(newsletter.hubspotUrl, { campaign: 'newsletter' })}
                    target="_blank"
                    rel="noreferrer"
                    className="pg-newsletter-external-link"
                  >
                    View in browser →
                  </a>
                </div>
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
              <Link href="/newsletters" className="pg-newsletter-sidebar-archive-link">
                ← View All Newsletters
              </Link>
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
