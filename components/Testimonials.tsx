'use client'

import { useState, useEffect, useCallback } from 'react'
import { PortableText } from '@portabletext/react'
import type { Testimonial } from '@/types'

const AUTO_ROTATE_INTERVAL = 8000

type TestimonialsProps = {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setActive(index)
      setFading(false)
    }, 300)
  }, [])

  const next = useCallback(() => {
    goTo((active + 1) % testimonials.length)
  }, [active, goTo, testimonials.length])

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(next, AUTO_ROTATE_INTERVAL)
    return () => clearInterval(timer)
  }, [next])

  const current = testimonials[active]
  if (!current) return null

  return (
    <section className="pg-testimonials">
      <div className="pg-testimonials-inner">
        <h2 className="pg-testimonials-title">Reasons to Choose Us</h2>

        <div className="pg-testimonials-quotemark" aria-hidden="true">
          <svg viewBox="0 0 448 512" width="56" height="56" fill="#000000">
            <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V216z"/>
          </svg>
        </div>

        <div
          className="pg-testimonial-content"
          style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.3s', fontWeight: '600', color: '#333' }}
        >

          <div className="pg-testimonial-body">
            <PortableText value={current.quote} />
          </div>
          <span className="pg-testimonial-author--home">
            — {current.clientName}
            {current.clientTitle && `, ${current.clientTitle}`}
          </span>
        </div>

        <div className="pg-testimonial-dots" role="tablist" aria-label="Testimonials">
          {testimonials.map((t, i) => (
            <button
              key={t._id}
              role="tab"
              aria-selected={i === active}
              aria-label={`Testimonial from ${t.clientName}`}
              className={`pg-dot${i === active ? ' pg-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
