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
import { SectionHeader, ContactLink } from '@/components'

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

function ImageSection({ section }: { section: NewsletterImageSection }) {
  const imageElement = (
    <Image
      src={section.image.asset.url}
      alt={section.alt || 'Newsletter section'}
      width={600}
      height={400}
      className="pg-newsletter-section-image"
      style={{ width: '100%', height: 'auto' }}
    />
  )

  // Render the image with optional link
  let linkedImage = imageElement
  if (section.linkUrl) {
    // Contact form trigger: #contact:Your message here
    if (section.linkUrl.startsWith('#contact:')) {
      const message = section.linkUrl.replace('#contact:', '')
      linkedImage = (
        <ContactLink message={message} className="pg-newsletter-section-link">
          {imageElement}
        </ContactLink>
      )
    } else if (section.linkUrl.startsWith('/')) {
      // Internal links use Next.js Link for client-side navigation
      linkedImage = (
        <Link href={section.linkUrl} className="pg-newsletter-section-link">
          {imageElement}
        </Link>
      )
    } else {
      // External links open in new tab with UTM params
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

  return (
    <>
      {linkedImage}
      {instagramLink}
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

  return (
    <main className="pg-page">
      {isPreview && (
        <div className="pg-preview-banner">
          Preview Mode — This is a draft
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
                      <ImageSection section={section} />
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
