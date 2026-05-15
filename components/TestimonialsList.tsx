'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Testimonial } from '@/types'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableText'
import { ContactBanner } from '@/components/ContactBanner'

type TestimonialsListProps = {
  testimonials: Testimonial[]
}

const MOBILE_INITIAL_COUNT = 3
const DESKTOP_INITIAL_COUNT = 4 // 2 rows × 2 columns
const MOBILE_LOAD_MORE = 5
const DESKTOP_LOAD_MORE = 6 // 3 rows × 2 columns
const MOBILE_BANNER_INTERVAL = 5
const DESKTOP_BANNER_INTERVAL = 6 // 3 rows × 2 columns
const LOAD_DELAY_MS = 800

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return initials.length < 2 ? name : initials
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = getInitials(testimonial.clientName)

  return (
    <div className="pg-testimonial-card">
      <div className="pg-testimonial-header">
        <div className="pg-testimonial-avatar">{initials}</div>
        <div className="pg-testimonial-user-info">
          <span className="pg-testimonial-name">{initials}</span>
          {testimonial.clientTitle && (
            <span className="pg-testimonial-handle">{testimonial.clientTitle}</span>
          )}
          <div className="pg-testimonial-footer">Verified Client</div>
        </div>
      </div>
      <div className="pg-testimonial-content">
        <PortableText value={testimonial.quote} components={portableTextComponents} />
      </div>
    </div>
  )
}

export function TestimonialsList({ testimonials }: TestimonialsListProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [visibleCount, setVisibleCount] = useState(DESKTOP_INITIAL_COUNT)
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadMore = useCallback(() => {
    if (isLoading) return

    setIsLoading(true)
    setTimeout(() => {
      const loadAmount = isMobile ? MOBILE_LOAD_MORE : DESKTOP_LOAD_MORE
      setVisibleCount((prev) => Math.min(prev + loadAmount, testimonials.length))
      setIsLoading(false)
    }, LOAD_DELAY_MS)
  }, [testimonials.length, isMobile, isLoading])

  useEffect(() => {
    if (!loadMoreRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < testimonials.length && !isLoading) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [visibleCount, testimonials.length, loadMore, isLoading])

  const displayedTestimonials = testimonials.slice(0, visibleCount)

  const renderItems = () => {
    const items: React.ReactNode[] = []

    displayedTestimonials.forEach((testimonial, index) => {
      items.push(
        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
      )

      const position = index + 1
      const bannerInterval = isMobile ? MOBILE_BANNER_INTERVAL : DESKTOP_BANNER_INTERVAL
      if (position % bannerInterval === 0) {
        items.push(
          <div key={`newsletter-${position}`} className="pg-testimonials-newsletter-insert">
            <ContactBanner
              title="Send us a testimonial on you experience!"
              cta="Get in Touch"
              contactMessage="I loved my experience and would love to share my testimonial with you."
              openContactForm
            />
          </div>
        )
      }
    })

    return items
  }

  return (
    <>
      <div className="pg-testimonials-list">
        {renderItems()}
      </div>

      {visibleCount < testimonials.length && (
        <div ref={loadMoreRef} className="pg-testimonials-load-more">
          {isLoading && <span className="pg-testimonials-loading">Loading...</span>}
        </div>
      )}
    </>
  )
}
