import type { Metadata } from 'next'
import type { NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import { formatDateOnly } from '@/lib/utils/dateTime'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newsletter Archive',
  description: 'Browse past newsletters from PorterGoldberg Residential — market updates, tips, and Chicago real estate insights.',
}

export const revalidate = 86400

async function getNewsletters(): Promise<NewsletterPreview[]> {
  try {
    return await client.fetch<NewsletterPreview[]>(ALL_NEWSLETTERS_QUERY)
  } catch (error) {
    console.error('Failed to fetch newsletters:', error)
    return []
  }
}

function NewsletterTeaser({ newsletter }: { newsletter: NewsletterPreview }) {
  return (
    <Link href={`/newsletters/${newsletter.slug.current}`} className="pg-newsletter-teaser">
      {/* {newsletter.coverImage?.asset?.url && (
        <div className="pg-newsletter-teaser-image">
          <Image
            src={newsletter.coverImage.asset.url}
            alt={newsletter.title}
            width={400}
            height={300}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )} */}
      <div className="pg-newsletter-teaser-content">
        <time className="pg-newsletter-teaser-date" dateTime={newsletter.publishedAt}>
          {formatDateOnly(newsletter.publishedAt)}
        </time>
        <h2 className="pg-newsletter-teaser-title">{newsletter.title}</h2>
        <p className="pg-newsletter-teaser-summary">{newsletter.summary}</p>
        <span className="pg-newsletter-teaser-link">Read more →</span>
      </div>
    </Link>
  )
}

export default async function NewslettersPage() {
  const newsletters = await getNewsletters()

  return (
    <main className="pg-newsletters-page">
      <section className="pg-newsletters-section">
        <div className="pg-newsletters-inner">
          <div className="pg-newsletters-header">
            <h1 className="pg-newsletters-page-title">Newsletter Archive</h1>
            <p className="pg-newsletters-page-subtitle">
              Market updates, tips, and insights from Porter Goldberg Residential.
            </p>
          </div>

          {newsletters.length > 0 ? (
            <div className="pg-newsletters-grid">
              {newsletters.map((newsletter) => (
                <NewsletterTeaser key={newsletter._id} newsletter={newsletter} />
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
