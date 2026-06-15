import type { PortableTextBlock } from '@portabletext/types'
import { PortableText } from '@portabletext/react'

type TestimonialData = {
  _id: string
  clientName: string
  clientTitle?: string
  date?: string
  quote: PortableTextBlock[]
}

type Props = {
  testimonial: TestimonialData
}

export function ExistingTestimonial({ testimonial }: Props) {
  // Parse date as local time (not UTC) to avoid timezone shift
  const formattedDate = testimonial.date
    ? new Date(testimonial.date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="pg-existing-testimonial">
      <p className="pg-existing-testimonial-intro">
        Here&apos;s what you shared with us:
      </p>

      <blockquote className="pg-existing-testimonial-quote">
        <PortableText value={testimonial.quote} />
      </blockquote>

      <div className="pg-existing-testimonial-meta">
        <p className="pg-existing-testimonial-name">— {testimonial.clientName}</p>
        {testimonial.clientTitle && (
          <p className="pg-existing-testimonial-title">{testimonial.clientTitle}</p>
        )}
        {formattedDate && (
          <p className="pg-existing-testimonial-date">Submitted {formattedDate}</p>
        )}
      </div>

      <p className="pg-existing-testimonial-note">
        If you&apos;d like to make changes to your testimonial, please contact us.
      </p>
    </div>
  )
}
