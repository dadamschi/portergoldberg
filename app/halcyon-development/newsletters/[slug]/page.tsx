import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/client'
import { HALCYON_NEWSLETTER_BY_SLUG_QUERY } from '@/lib/queries'
import type { HalcyonNewsletter } from '@/types'

export const revalidate = 86400 // 24 hours

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const newsletter = await client.fetch<HalcyonNewsletter>(
    HALCYON_NEWSLETTER_BY_SLUG_QUERY,
    { slug }
  )

  if (!newsletter) {
    return {
      title: 'Newsletter Not Found',
    }
  }

  const seasonTitle = newsletter.season.charAt(0).toUpperCase() + newsletter.season.slice(1)

  return {
    title: `${seasonTitle} Home Care Guide | Halcyon Development`,
    description: newsletter.previewText || newsletter.introduction,
  }
}

const SEASON_EMOJI: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  fall: '🍂',
  winter: '❄️',
}

export default async function HalcyonNewsletterPage({ params }: Props) {
  const { slug } = await params
  const newsletter = await client.fetch<HalcyonNewsletter>(
    HALCYON_NEWSLETTER_BY_SLUG_QUERY,
    { slug }
  )

  if (!newsletter) {
    notFound()
  }

  const emoji = SEASON_EMOJI[newsletter.season] || '🏠'
  const seasonTitle = newsletter.season.charAt(0).toUpperCase() + newsletter.season.slice(1)

  return (
    <main className="pg-main-content">
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>{emoji}</p>
          <h1 style={{ fontSize: '42px', fontWeight: 600, margin: '0 0 8px 0' }}>
            {seasonTitle} Home Care
          </h1>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            {new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </p>
        </header>

        {/* Introduction */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>
            {newsletter.introduction}
          </p>
        </div>

        {/* Maintenance Checklist */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>
            Maintenance Checklist
          </h2>
          <div style={{ display: 'grid', gap: '24px' }}>
            {newsletter.maintenanceChecklist.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '24px',
                  border: '1px solid #dedbd6',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, color: '#555' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Home Tip */}
        {newsletter.homeTip && (
          <section style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#f5f3ee', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>💡</span>
              <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
                {newsletter.homeTip.title}
              </h2>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, color: '#333' }}>
              {newsletter.homeTip.content}
            </p>
          </section>
        )}

        {/* Did You Know */}
        {newsletter.didYouKnow && (
          <section style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#f5f3ee', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>🤔</span>
              <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
                {newsletter.didYouKnow.title}
              </h2>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, color: '#333' }}>
              {newsletter.didYouKnow.content}
            </p>
          </section>
        )}

        {/* Luxury Spotlight */}
        {newsletter.luxurySpotlight && (
          <section style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#f5f3ee', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>✨</span>
              <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
                {newsletter.luxurySpotlight.title}
              </h2>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, color: '#333' }}>
              {newsletter.luxurySpotlight.content}
            </p>
          </section>
        )}

        {/* Additional Section */}
        {newsletter.additionalSection && (
          <section style={{ marginBottom: '48px', padding: '32px', backgroundColor: '#f5f3ee', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 12px 0' }}>
              {newsletter.additionalSection.title}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, color: '#333' }}>
              {newsletter.additionalSection.content}
            </p>
          </section>
        )}

        {/* Looking Ahead */}
        {newsletter.lookingAhead && (
          <section style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid #dedbd6' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 12px 0' }}>
              Looking Ahead
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, color: '#555', fontStyle: 'italic' }}>
              {newsletter.lookingAhead}
            </p>
          </section>
        )}
      </article>
    </main>
  )
}
