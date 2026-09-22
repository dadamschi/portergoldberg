import { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/client'
import { ALL_HALCYON_NEWSLETTERS_QUERY } from '@/lib/queries'
import type { HalcyonNewsletterPreview } from '@/types'

export const metadata: Metadata = {
  title: 'Seasonal Home Care Newsletters | Halcyon Development',
  description: 'Seasonal maintenance guides and care tips for your Halcyon home.',
  robots: 'noindex',
}

export const revalidate = 86400 // 24 hours

const SEASON_EMOJI: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  fall: '🍂',
  winter: '❄️',
}

export default async function HalcyonNewslettersPage() {
  const newsletters = await client.fetch<HalcyonNewsletterPreview[]>(ALL_HALCYON_NEWSLETTERS_QUERY)

  return (
    <main className="pg-main-content">
      <div className="pg-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
          Seasonal Home Care
        </h1>
        <p style={{ fontSize: '18px', color: '#666', textAlign: 'center', marginBottom: '60px' }}>
          Expert maintenance guides to protect your Halcyon investment
        </p>

        {newsletters.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No newsletters available yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '32px' }}>
            {newsletters.map((newsletter) => {
              const date = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })
              const emoji = SEASON_EMOJI[newsletter.season] || '🏠'
              const seasonTitle = newsletter.season.charAt(0).toUpperCase() + newsletter.season.slice(1)

              return (
                <Link
                  key={newsletter._id}
                  href={`/halcyon-development/newsletters/${newsletter.slug.current}`}
                  className="pg-newsletter-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '36px' }}>{emoji}</span>
                    <div>
                      <h2 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>
                        {seasonTitle} Home Care
                      </h2>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{date}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                    {newsletter.emailSubject.replace(/[🍂🌸☀️❄️]/g, '').trim()}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
