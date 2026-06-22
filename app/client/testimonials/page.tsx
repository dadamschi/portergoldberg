import { Testimonial } from '@/types'
import { client } from '@/lib/client'
import { UNPUBLISHED_DRAFTS_QUERY } from '@/lib/queries'
import { ContentTemplate, TestimonialsList } from '@/components'

async function getDraftTestimonials(): Promise<Testimonial[]> {
    const data = await client.fetch<Testimonial[]>(UNPUBLISHED_DRAFTS_QUERY, {}, { perspective: 'raw', useCdn: false })
    return data
}

export default async function ClientDraftTestimonials() {
  const testimonials = await getDraftTestimonials()

  console.log(testimonials)

  const title = 'Draft Client Testimonials'
  const heroData = {
    title,
    heroHeadline: 'Testimonials sent out to clients and not yet responded'
  }

  return (
    <ContentTemplate
          title={title}
          heroData={heroData}
        >
          <div className="pg-testimonials-inner">
                    {testimonials.length > 0 ? (
                      <TestimonialsList testimonials={testimonials} />
                    ) : (
                      <p className="pg-testimonials-empty">
                        No Draft Testimonials available at this time.
                      </p>
                    )}
                  </div>
          </ContentTemplate>
  )
}
