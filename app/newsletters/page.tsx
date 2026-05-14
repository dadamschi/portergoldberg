import type { Metadata } from 'next'
import type { NewsletterPreview } from '@/types'
import { client } from '@/lib/client'
import { ALL_NEWSLETTERS_QUERY } from '@/lib/queries'
import Link from 'next/link'
import Image from 'next/image'

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

function formatShortDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function groupByYear(newsletters: NewsletterPreview[]) {
  const groups: Record<string, NewsletterPreview[]> = {}
  for (const newsletter of newsletters) {
    const year = new Date(newsletter.publishedAt).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(newsletter)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
}

export default async function NewslettersPage() {
  const newsletters = await getNewsletters()
  const groupedNewsletters = groupByYear(newsletters)

  return (
    <main className="pg-page">
      <section className="pg-page-hero">
        <h1>Newsletter Archive</h1>
        <p>Market updates, tips, and insights from PorterGoldberg Residential.</p>
      </section>

      <section className="pg-newsletters-section">
        <div className="pg-newsletters-inner">
          {groupedNewsletters.length > 0 ? (
            <div className="pg-newsletter-archive">
              <div className="pg-newsletter-header-image">
                <Image
                  src="/ywwt.svg"
                  alt="Your Weekly Walk-Through"
                  width={800}
                  height={200}
                  priority
                  style={{ width: '100%', height: 'auto', maxWidth: '800px' }}
                />
              </div>
              {groupedNewsletters.map(([year, items]) => (
                <div key={year} className="pg-newsletter-year-group">
                  <h2 className="pg-newsletter-year">{year}</h2>
                  <ul className="pg-newsletter-list">
                    {items.map((newsletter) => (
                      <li key={newsletter._id} className="pg-newsletter-item">
                        <span className="pg-newsletter-item-date">
                          {formatShortDate(newsletter.publishedAt)}
                        </span>
                        <Link
                          href={`/newsletters/${newsletter.slug.current}`}
                          className="pg-newsletter-item-link"
                        >
                          {newsletter.summary}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
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
