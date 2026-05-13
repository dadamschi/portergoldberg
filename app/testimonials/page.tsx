import type { Metadata } from 'next'
import type { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableText'

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what our clients say about working with Porter Goldberg Residential.',
}

export const revalidate = 86400

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch<Testimonial[]>(ALL_TESTIMONIALS_QUERY)
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const cardClass = testimonial.pinOnHomePage ? 'pg-testimonial-card--featured' : ''
  let initials = getInitials(testimonial.clientName)
  initials = initials.length < 2 ? testimonial.clientName : initials
  console.log(testimonial.clientName, initials)

  return (
    <div className={`pg-testimonial-card`}>
      <div className="pg-testimonial-header">
        <div className="pg-testimonial-avatar">{initials}</div>
        <div className="pg-testimonial-user-info">
          <span className="pg-testimonial-name">{testimonial.clientName}</span>
          {testimonial.clientTitle && (
            <span className="pg-testimonial-handle">{testimonial.clientTitle}</span>
          )}
          {testimonial.clientName.length <= 2 && 
          (
            <div className="pg-testimonial-footer">Verified Client</div>
          )}
        </div>
      </div>
      <div className="pg-testimonial-content">
        <PortableText value={testimonial.quote} components={portableTextComponents} />
      </div>
    </div>
  )
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

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
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
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
