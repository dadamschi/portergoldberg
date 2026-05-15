import type { Metadata } from 'next'
import type { NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateOnly } from '@/lib/utils/dateTime'

export const metadata: Metadata = {
  title: 'Newsletter Archive',
  description: 'Browse past newsletters from PorterGoldberg Residential — market updates, tips, and Chicago real estate insights.',
  alternates: {
    canonical: 'https://portergoldberg.com/newsletters',
  },
  openGraph: {
    title: 'Newsletter Archive | PorterGoldberg Residential',
    description: 'Browse past newsletters from PorterGoldberg Residential — market updates, tips, and Chicago real estate insights.',
    url: 'https://portergoldberg.com/newsletters',
    type: 'website',
    siteName: 'PorterGoldberg Residential',
  },
}

export const revalidate = 604800 // 1 week - webhook handles on-demand revalidation

async function getNewsletters(): Promise<NewsletterPreview[]> {
  try {
    return await client.fetch<NewsletterPreview[]>(ALL_NEWSLETTERS_QUERY)
  } catch (error) {
    console.error('Failed to fetch newsletters:', error)
    return []
  }
}

function NewsletterCard({ newsletter }: { newsletter: NewsletterPreview }) {
  return (
    <Link
      href={`/newsletters/${newsletter.slug.current}`}
      className="pg-newsletter-card"
    >
      <div className="pg-newsletter-card-image">
        {newsletter.thumbnail?.asset?.url ? (
          <Image
            src={newsletter.thumbnail.asset.url}
            alt={newsletter.thumbnail.alt || newsletter.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="pg-newsletter-card-placeholder">
            <span>YWWT</span>
          </div>
        )}
      </div>
      <div className="pg-newsletter-card-content">
        <time className="pg-newsletter-card-date" dateTime={newsletter.publishedAt}>
          {formatDateOnly(newsletter.publishedAt)}
        </time>
        <h2 className="pg-newsletter-card-title">{newsletter.title}</h2>
        <p className="pg-newsletter-card-summary">{newsletter.summary}</p>
      </div>
    </Link>
  )
}

export default async function NewslettersPage() {
  const newsletters = await getNewsletters()

  // Insert banner after 9 cards (3 rows of 3)
  const BANNER_AFTER = 9
  const firstBatch = newsletters.slice(0, BANNER_AFTER)
  const secondBatch = newsletters.slice(BANNER_AFTER)

  return (
    <main className="pg-page">
      <section className="pg-page-hero">
        <div className="pg-newsletter-header-image">
          <Image
            src="/ywwt2.svg"
            alt="Your Weekly Walk-Through"
            width={800}
            height={200}
            priority
            style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
          />
        </div>
        <p>Market updates, tips, and insights from PorterGoldberg Residential.</p>
      </section>

      <section className="pg-newsletters-section">
        <div className="pg-newsletters-inner">
          {newsletters.length > 0 ? (
            <div className="pg-newsletter-blog-grid">
              {firstBatch.map((newsletter) => (
                <NewsletterCard key={newsletter._id} newsletter={newsletter} />
              ))}

              {newsletters.length > BANNER_AFTER && (
                <div className="pg-contact-banner">
                  <Image
                    src="/ywwt2.svg"
                    alt="Your Weekly Walk-Through"
                    width={800}
                    height={200}
                    style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
                  />
                </div>
              )}

              {secondBatch.map((newsletter) => (
                <NewsletterCard key={newsletter._id} newsletter={newsletter} />
              ))}
            </div>
          ) : (
            <p className="pg-newsletters-empty">
              No newsletters available yet. Subscribe to be notified when we publish.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
