import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Newsletter, NewsletterImageSection, NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { NEWSLETTER_BY_SLUG_QUERY, ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableText'
import { formatDateOnly } from '@/lib/utils/dateTime'
import { addUtmParams } from '@/lib/utils/utm'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components'

export const revalidate = 86400

type Props = {
  params: Promise<{ slug: string }>
}

async function getNewsletter(slug: string): Promise<Newsletter | null> {
  return client.fetch<Newsletter | null>(NEWSLETTER_BY_SLUG_QUERY, { slug })
}

async function getAllNewsletters(): Promise<NewsletterPreview[]> {
  return client.fetch<NewsletterPreview[]>(ALL_NEWSLETTERS_QUERY)
}

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

  const url = `https://portergoldberg.com/newsletters/${slug}`

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

  if (section.linkUrl) {
    return (
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

  return imageElement
}

export default async function NewsletterPage({ params }: Props) {
  const { slug } = await params
  const [newsletter, allNewsletters] = await Promise.all([
    getNewsletter(slug),
    getAllNewsletters()
  ])

  if (!newsletter) {
    notFound()
  }

  // Filter out current newsletter from sidebar list
  const otherNewsletters = allNewsletters.filter(
    (n) => n.slug.current !== slug
  )

  return (
    <main className="pg-newsletter-detail-page">
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

              {/* Text content for SEO */}
              {newsletter.textContent && newsletter.textContent.length > 0 && (
                <div className="pg-newsletter-text-content">
                  <PortableText value={newsletter.textContent} components={portableTextComponents} />
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
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
