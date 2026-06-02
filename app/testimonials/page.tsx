import type { Metadata } from 'next'
import type { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/queries'
import { TestimonialsList } from '@/components/TestimonialsList'

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what our clients say about working with PorterGoldberg Residential.',
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

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <main className="pg-page pg-testimonials-page">
      <section className="pg-page-hero">
        <h1>Testimonials</h1>
        <p>Hear from our clients about their experience working with PorterGoldberg</p>
      </section>

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
    </main>
  )
}
