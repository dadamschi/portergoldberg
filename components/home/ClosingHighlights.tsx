'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { ClosingHighlight } from '@/types'
import { textToMoney } from '@/lib/utils/text'

const AUTOPLAY_MS = 5000

const REPRESENTATION_LABEL: Record<ClosingHighlight['representation'], string> = {
  buyer: 'Represented Buyer',
  seller: 'Represented Seller',
}

type ClosingHighlightsProps = {
  items: ClosingHighlight[]
}

function formatPrice(price?: string): string | null {
  if (!price) return null
  // Ranges are stored as display text already (e.g. "$1.2M – $1.25M")
  if (price.includes('–') || price.includes(' - ')) return price
  return textToMoney(price)
}

function formatDetails({ beds, baths, units }: ClosingHighlight): string {
  return [
    beds ? `${beds} Bed${beds !== '1' ? 's' : ''}` : null,
    baths ? `${baths} Bath${baths !== '1' ? 's' : ''}` : null,
    units && units >= 2 ? `${units} Units` : null,
  ]
    .filter(Boolean)
    .join(' · ')
}

function useCardsPerView(): number {
  const [perView, setPerView] = useState(4)
  useEffect(() => {
    const small = window.matchMedia('(max-width: 760px)')
    const medium = window.matchMedia('(max-width: 1100px)')
    const update = () => setPerView(small.matches ? 1 : medium.matches ? 2 : 4)
    update()
    small.addEventListener('change', update)
    medium.addEventListener('change', update)
    return () => {
      small.removeEventListener('change', update)
      medium.removeEventListener('change', update)
    }
  }, [])
  return perView
}

function RepresentationBanner({ representation }: { representation: ClosingHighlight['representation'] }) {
  return (
    <span className={`pg-ch-banner pg-ch-banner--${representation}`}>
      {REPRESENTATION_LABEL[representation]}
    </span>
  )
}

export function ClosingHighlights({ items }: ClosingHighlightsProps) {
  const perView = useCardsPerView()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [story, setStory] = useState<ClosingHighlight | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const count = items.length
  const maxIndex = Math.max(0, count - perView)
  const positions = maxIndex + 1
  const current = Math.min(index, maxIndex)

  const next = useCallback(() => setIndex((i) => (Math.min(i, maxIndex) >= maxIndex ? 0 : i + 1)), [maxIndex])
  const prev = useCallback(() => setIndex((i) => (Math.min(i, maxIndex) <= 0 ? maxIndex : i - 1)), [maxIndex])

  // Respect reduced-motion: start paused, the viewer can still press Play
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
  }, [])

  useEffect(() => {
    if (!playing || interacting || story || positions < 2) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') next()
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [playing, interacting, story, positions, next])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (story && !dialog.open) dialog.showModal()
    if (!story && dialog.open) dialog.close()
  }, [story])

  if (count === 0) return null

  const storyPrice = story ? formatPrice(story.price) : null
  const storyDetails = story ? formatDetails(story) : ''

  return (
    <section className="pg-listings" aria-labelledby="pg-ch-title">
      <div className="pg-section-head" style={{ flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '2px', marginTop: '8px' }}>
        <h2 id="pg-ch-title" className="pg-section-title" style={{ marginBottom: 0, fontSize: '46px', fontWeight: 600, color: '#000' }}>
          Closing Highlights &amp; Success Stories
        </h2>
      </div>

      <div className="pg-ch-inner">

        <div className="pg-ch-carousel" role="region" aria-roledescription="carousel" aria-label="Closing highlights">
          {positions > 1 && (
            <button type="button" className="pg-ch-arrow" aria-label="Previous properties" onClick={prev}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          )}

          <div
            className="pg-ch-viewport"
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            onFocus={() => setInteracting(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setInteracting(false)
            }}
          >
            <ul
              className="pg-ch-track"
              style={{ '--pg-ch-per': perView, '--pg-ch-index': current } as React.CSSProperties}
              aria-live={playing && !interacting ? 'off' : 'polite'}
            >
              {items.map((item, i) => {
                const visible = i >= current && i < current + perView
                const price = formatPrice(item.price)
                const details = formatDetails(item)
                const place = item.neighborhood || item.city || 'Chicago'
                return (
                  <li
                    key={item._id}
                    className="pg-ch-slide"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}: ${item.address}`}
                    aria-hidden={!visible}
                    inert={!visible}
                  >
                    <article className="pg-ch-card">
                      <div className="pg-ch-media">
                        {item.image?.asset?.url ? (
                          <Image
                            src={item.image.asset.url}
                            alt={item.image.alt || `${item.address}, ${place} – sold`}
                            fill
                            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 420px"
                            style={{ objectFit: 'cover' }}
                            placeholder={item.image.asset.metadata?.lqip ? 'blur' : 'empty'}
                            blurDataURL={item.image.asset.metadata?.lqip}
                          />
                        ) : (
                          <div className="pg-ch-media-empty" />
                        )}
                        <RepresentationBanner representation={item.representation} />
                      </div>
                      <div className="pg-ch-body">
                        <p className="pg-ch-place">{place}</p>
                        {/* <h3 className="pg-ch-address">{item.address}</h3> */}
                        {/* <p className="pg-ch-details">{[price && `Sold ${price}`, details].filter(Boolean).join(' · ')}</p> */}
                      </div>
                      {item.successStory && (
                        <div className="pg-ch-actions">
                          <button type="button" className="pg-ch-story-btn" onClick={() => setStory(item)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M4 5h16v12H8l-4 3z" />
                            </svg>
                            Success Story
                          </button>
                        </div>
                      )}
                    </article>
                  </li>
                )
              })}
            </ul>
          </div>

          {positions > 1 && (
            <button type="button" className="pg-ch-arrow" aria-label="Next properties" onClick={next}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>

        {positions > 1 && (
          <div className="pg-ch-controls">
            <div className="pg-ch-dots">
              {Array.from({ length: positions }, (_, p) => (
                <button
                  key={p}
                  type="button"
                  className={`pg-ch-dot${p === current ? ' pg-ch-dot--active' : ''}`}
                  aria-label={`Show ${items[p].address}`}
                  aria-current={p === current}
                  onClick={() => setIndex(p)}
                >
                  <span />
                </button>
              ))}
            </div>
            <span className="pg-ch-counter">
              {String(current + 1).padStart(2, '0')} / {String(positions).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="pg-ch-play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause rotation' : 'Play rotation'}
            >
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="pg-ch-dialog"
        aria-labelledby="pg-ch-dialog-title"
        onClose={() => setStory(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setStory(null)
        }}
      >
        {story && (
          <div className="pg-ch-dialog-panel">
            <div className="pg-ch-dialog-media">
              {story.image?.asset?.url && (
                <Image
                  src={story.image.asset.url}
                  alt={story.image.alt || `${story.address} – sold`}
                  fill
                  sizes="(max-width: 760px) 100vw, 460px"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <RepresentationBanner representation={story.representation} />
            </div>
            <div className="pg-ch-dialog-body">
              <div className="pg-ch-dialog-top">
                <p className="pg-ch-eyebrow">Success Story</p>
                <button type="button" className="pg-ch-close" aria-label="Close" onClick={() => setStory(null)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>
              {/* <h3 id="pg-ch-dialog-title" className="pg-ch-dialog-title">{story.address}</h3> */}
              <p className="pg-ch-details">
                {[story.neighborhood || story.city, storyPrice && `Sold ${storyPrice}`, storyDetails].filter(Boolean).join(' · ')}
              </p>
              <hr className="pg-ch-rule" />
              <p className="pg-ch-story">{story.successStory}</p>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
