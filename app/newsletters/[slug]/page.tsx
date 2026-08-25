import type { Metadata } from 'next'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { Newsletter, NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { NEWSLETTER_BY_SLUG_QUERY, ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import { formatDateOnly } from '@/lib/utils/dateTime'
import Link from 'next/link'
import { NewsletterDownloadButton } from '@/components'
import { SideBySideLayout } from '@/components/newsletter/SideBySideLayout'
import { StackedLayout } from '@/components/newsletter/StackedLayout'
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

  // Determine layout based on publish date
  // Newsletters on/after July 27, 2026 use stacked layout
  // Newsletters before July 27, 2026 use side-by-side layout
  const STACKED_CUTOFF_DATE = new Date('2026-07-27')
  const publishedDate = new Date(newsletter.publishedAt)
  const isStacked = publishedDate >= STACKED_CUTOFF_DATE

  if (isPreview) {
    console.log('[Newsletter] Preview mode enabled for newsletter:', slug)
    console.log('[Newsletter] Preview mode enabled for newsletter:', newsletter)
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
    phone: s.phone,
    email: s.email,
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

              {/* Image sections - layout based on publish date */}
              {newsletter.imageSections && newsletter.imageSections.length > 0 && (
                isStacked ? (
                  <StackedLayout sections={newsletter.imageSections} />
                ) : (
                  <SideBySideLayout sections={newsletter.imageSections} />
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
