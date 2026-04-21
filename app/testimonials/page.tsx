import type { Metadata } from 'next'
import type { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/queries'
import { PortableText } from '@portabletext/react'

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what our clients say about working with Porter Goldberg Residential.',
}

export const revalidate = 3600

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch<Testimonial[]>(ALL_TESTIMONIALS_QUERY)
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const isAlt = index % 2 === 1;
  const cardClass = testimonial.pinOnHomePage ? `pg-testimonial-card--featured` : '';
  return (
    <div className={`pg-testimonial-card ${cardClass}`}>
      <div className="pg-testimonial-content">
        <PortableText value={testimonial.quote} />
      </div>
      <p className="pg-testimonial-author">- {testimonial.clientName}</p>
      {testimonial.clientTitle && (
        <p className="pg-testimonial-meta">
          <span className="pg-testimonial-position">{testimonial.clientTitle}</span>
        </p>
      )}
    </div>
  )
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  console.log('testimonials', testimonials)

  return (
    <main className="pg-testimonials-page">
      <section className="pg-testimonials-section">
        <div className="pg-testimonials-inner">
          <div className="pg-testimonials-header">
            <h1 className="pg-testimonials-page-title">Testimonials</h1>
            <p className="pg-testimonials-page-subtitle">
              Hear from our clients about their experience working with <br />Porter Goldberg.
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="pg-testimonials-list">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} index={index} />
              ))}
            </div>
          ) : (
            <p className="pg-testimonials-empty">
              No testimonials available at this time.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
