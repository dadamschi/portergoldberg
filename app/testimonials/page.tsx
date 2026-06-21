import type { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { ALL_TESTIMONIALS_QUERY } from '@/lib/queries'
import { TestimonialsList } from '@/components/TestimonialsList'
import { createMetadata } from '@/lib/metadata'
import { ContentTemplate } from '@/components/contentTemplate'

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

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  const title = 'Client Reviews & Testimonials'
  const heroData = {
    heroHeadline: 'Hear from our clients about their experience buying and selling homes with PorterGoldberg',
  }

  return (
    <ContentTemplate
              title={title}
              heroData={heroData}
            >

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
