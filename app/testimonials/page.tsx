import type { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/queries'
import { TestimonialsList } from '@/components/TestimonialsList'
import { createMetadata } from '@/lib/metadata'
import { ContentTemplate } from '@/components/contentTemplate'
import { toPlainText } from '@/lib/utils/text'

export const metadata = createMetadata({
  title: 'Client Reviews & Testimonials',
  description: 'Read reviews and testimonials from our clients about their experience buying and selling homes with PorterGoldberg Residential in Chicago.',
  path: '/testimonials',
})

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch<Testimonial[]>(ALL_TESTIMONIALS_QUERY)
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

function generateTestimonialsSchema(testimonials: Testimonial[]) {
  const reviews = testimonials.map((testimonial) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: testimonial.clientName,
    },
    reviewBody: toPlainText(testimonial.quote),
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    datePublished: testimonial.date,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PorterGoldberg Residential',
    url: 'https://portergoldberg.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 5,
      reviewCount: testimonials.length,
      bestRating: 5,
    },
    review: reviews,
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  const title = 'Client Reviews & Testimonials'
  const heroData = {
    heroHeadline: 'Hear from our clients about their experience buying and selling homes with PorterGoldberg',
  }

  const schemaData = testimonials.length > 0 ? generateTestimonialsSchema(testimonials) : null

  return (
    <ContentTemplate
              title={title}
              heroData={heroData}
            >
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      <section className="pg-testimonials-section">
        <div className="pg-testimonials-inner">
          {testimonials.length > 0 ? (
            <TestimonialsList testimonials={testimonials} />
          ) : (
            <p className="pg-testimonials-empty">
              No testimonials available at this time.
            </p>
          )}
        </div>
      </section>
    </ContentTemplate>
  )
}
