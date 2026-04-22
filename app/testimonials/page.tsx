import type { Metadata } from 'next'
import type { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/queries'
import { PortableText, toPlainText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portableText'

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what our clients say about working with Porter Goldberg Residential.',
}

function ReviewsJsonLd({ testimonials }: { testimonials: Testimonial[] }) {
  const reviews = testimonials.map((t) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: t.clientName,
    },
    reviewBody: toPlainText(t.quote),
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Porter Goldberg Residential',
    url: 'https://portergoldberg.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 5,
      reviewCount: testimonials.length,
      bestRating: 5,
    },
    review: reviews.slice(0, 10), // Limit to 10 reviews for schema
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
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

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const cardClass = testimonial.pinOnHomePage ? `pg-testimonial-card--featured` : '';
  return (
    <div className={`pg-testimonial-card ${cardClass}`}>
      <div className="pg-testimonial-content">
        <PortableText value={testimonial.quote} components={portableTextComponents} />
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

  return (
    <main className="pg-testimonials-page">
      <ReviewsJsonLd testimonials={testimonials} />
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
