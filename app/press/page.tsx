import type { Metadata } from 'next'
import Image from 'next/image'
import { client } from '@/lib/client'
import { PRESS_QUERY } from '@/lib/queries'
import { addUtmParams } from '@/lib/utils/utm'
import { formatMonthYear } from '@/lib/utils/dateTime'
import type { PressItem } from '@/types'

export const metadata: Metadata = {
  title: 'Press',
  description: 'PorterGoldberg Residential in the press - featured articles and media coverage.',
}

export const revalidate = 86400

async function getPressItems(): Promise<PressItem[]> {
  return client.fetch<PressItem[]>(PRESS_QUERY)
}

function LogoCollage({ items }: { items: PressItem[] }) {
  // Get unique logos by publication name
  const uniqueLogos = items.reduce((acc, item) => {
    if (!acc.find((i) => i.publication === item.publication)) {
      acc.push(item)
    }
    return acc
  }, [] as PressItem[])

  return (
    <div className="pg-press-collage">
      {uniqueLogos.map((item, index) => (
        <div key={item._id} className="pg-press-collage-item" style={{ animationDelay: `${index * 0.1}s` }}>
          <Image
            src={item.logo.asset.url}
            alt={item.publication}
            fill
            sizes="150px"
            style={{ objectFit: 'contain' }}
          />
        </div>
      ))}
    </div>
  )
}

function PressCard({ item }: { item: PressItem }) {
  const hasBackground = !!item.backgroundImage?.asset?.url
  const url = item.pdfUrl || item.articleUrl || '#'
  const isPdf = item.pdfUrl || url.toLowerCase().endsWith('.pdf')

  return (
    <a
      href={item.pdfUrl ? url : addUtmParams(url, { campaign: 'press' })}
      target="_blank"
      rel="noopener noreferrer"
      className={`pg-press-card ${!hasBackground ? 'pg-press-card--logo-only' : ''}`}
    >
      {hasBackground && item.backgroundImage && (
        <Image
          src={item.backgroundImage.asset.url}
          alt={item.articleTitle || item.publication}
          fill
          sizes="300px"
          style={{ objectFit: 'cover' }}
          className="pg-press-bg"
        />
      )}
      {hasBackground && <div className="pg-press-overlay" />}
      {isPdf && (
        <span className="pg-press-pdf-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          PDF
        </span>
      )}
      <div className="pg-press-content">
        <div className={`pg-press-logo ${!hasBackground ? 'pg-press-logo--full' : ''}`}>
          <Image
            src={item.logo.asset.url}
            alt={item.publication}
            fill
            sizes={hasBackground ? '100px' : '260px'}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="pg-press-info">
          <span className="pg-press-publication">{item.articleTitle}</span>
          {item.date && (
            <span className="pg-press-date">{formatMonthYear(item.date)}</span>
          )}
        </div>
      </div>
    </a>
  )
}

export default async function PressPage() {
  const pressItems = await getPressItems()

  return (
    <main className="pg-page pg-press-page">
      <section className="pg-page-hero">
        <h1>In the Press</h1>
        <p>PorterGoldberg featured in media and publications.</p>
      </section>

      {pressItems.length > 0 && (
        <section className="pg-press-collage-section">
          <LogoCollage items={pressItems} />
        </section>
      )}

      <section className="pg-press-section">
        <div className="pg-press-inner">
          {pressItems.length > 0 ? (
            <div className="pg-press-grid">
              {pressItems.map((item) => (
                <PressCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="pg-press-empty">
              Press coverage coming soon.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
