import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Newsletter, NewsletterImageSection } from '@/types'
import { client } from '@/lib/client'
import { NEWSLETTER_BY_SLUG_QUERY } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableText'
import { formatDateOnly } from '@/lib/utils/dateTime'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 86400

type Props = {
  params: Promise<{ slug: string }>
}

async function getNewsletter(slug: string): Promise<Newsletter | null> {
  try {
    return await client.fetch<Newsletter | null>(NEWSLETTER_BY_SLUG_QUERY, { slug })
  } catch (error) {
    console.error('Failed to fetch newsletter:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const newsletter = await getNewsletter(slug)

  if (!newsletter) {
    return { title: 'Newsletter Not Found' }
  }

  return {
    title: newsletter.title,
    description: newsletter.summary,
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
        href={section.linkUrl}
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
  const newsletter = await getNewsletter(slug)

  if (!newsletter) {
    notFound()
  }

  return (
    <main className="pg-newsletter-detail-page">
      <section className="pg-newsletter-detail-section">
        <div className="pg-newsletter-detail-inner">
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
                {newsletter.imageSections.map((section) => (
                  <ImageSection key={section._key} section={section} />
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
                  href={newsletter.hubspotUrl}
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
      </section>
    </main>
  )
}
