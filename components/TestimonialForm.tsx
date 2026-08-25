'use client'

import { useState } from 'react'

type ExistingData = {
  testimonialId: string
  clientName: string
  clientTitle: string
  quote: string
}

type Props = {
  token: string
  defaultName: string
  googleReviewUrl?: string
  zillowReviewUrl?: string
  existingData?: ExistingData
  dealName?: string
}

export function TestimonialForm({ token, defaultName, googleReviewUrl, zillowReviewUrl, existingData, dealName }: Props) {
  const [formData, setFormData] = useState({
    clientName: existingData?.clientName || defaultName,
    clientTitle: existingData?.clientTitle || dealName || '',
    quote: existingData?.quote || '',
  })
  const isEditing = !!existingData
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  console.log(existingData)
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/submit-testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          clientName: formData.clientName,
          clientTitle: formData.clientTitle,
          quote: formData.quote,
          testimonialId: existingData?.testimonialId,
          date: new Date().toISOString().split('T')[0],
          dealName
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  // Fallback to Google Maps page if direct review URL not configured
  const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/PorterGoldberg+Residential+%7C+Samantha+Porter+%26+Lauren+Goldberg/@41.9148645,-87.6618455,12z/data=!4m6!3m5!1s0x207634bdb970231d:0xb74d4313170b93a3!8m2!3d41.9148646!4d-87.6618455!16s%2Fg%2F11y3l222gx?entry=ttu'

  const handleCopyAndGoogleReview = () => {
    navigator.clipboard.writeText(formData.quote)
    window.open(googleReviewUrl || GOOGLE_MAPS_URL, '_blank')
  }

  const handleCopyAndZillowReview = () => {
    navigator.clipboard.writeText(formData.quote)
    window.open(zillowReviewUrl || 'https://www.zillow.com/profile/portergoldberg#reviews', '_blank')
  }

  if (status === 'success') {
    return (
      <div className="pg-testimonial-success">
        <h2>Thank You!</h2>
        <p>We truly appreciate you taking the time to share your experience with us.</p>

        <div className="pg-testimonial-submitted">
          <h3>Your Testimonial</h3>
          <blockquote>{formData.quote}</blockquote>
          <p className="pg-testimonial-attribution">— {formData.clientName}</p>
        </div>

        <div className="pg-testimonial-reviews">
          <h3>Help Us Reach More Clients</h3>
          <p>Would you mind sharing your experience on Google or Zillow? It only takes a minute and helps others find us.</p>
          <div className="pg-testimonial-review-buttons">
            <button
              type="button"
              onClick={handleCopyAndGoogleReview}
              className="pg-testimonial-review-btn"
            >
              Copy & Leave Google Review
            </button>
            <button
              type="button"
              onClick={handleCopyAndZillowReview}
              className="pg-testimonial-review-btn"
            >
              Copy & Leave Zillow Review
            </button>
          </div>
          <p className="pg-testimonial-hint">
            We&apos;ll copy your testimonial to your clipboard. Click &quot;Write a review&quot; and paste it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="pg-testimonial-form" onSubmit={handleSubmit}>
      <div className="pg-testimonial-field">
        <label htmlFor="clientName">Your Name</label>
        <input
          id="clientName"
          type="text"
          required
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          className="pg-contact-input"
        />
      </div>

      <div className="pg-testimonial-field">
        <label htmlFor="clientTitle">Company or Location <span>(optional)</span></label>
        <input
          id="clientTitle"
          type="text"
          placeholder="e.g., Lincoln Park, Chicago"
          value={formData.clientTitle}
          onChange={(e) => setFormData({ ...formData, clientTitle: e.target.value })}
          className="pg-contact-input"
        />
      </div>

      <div className="pg-testimonial-field">
        <label htmlFor="quote">Your Experience</label>
        <textarea
          id="quote"
          required
          rows={6}
          placeholder="Tell us about your experience working with us..."
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          className="pg-contact-textarea"
        />
      </div>

      <button
        type="submit"
        className="pg-contact-submit"
        disabled={status === 'loading'}
      >
        {status === 'loading'
          ? (isEditing ? 'Saving...' : 'Submitting...')
          : (isEditing ? 'Save Changes' : 'Submit Testimonial')}
      </button>

      {status === 'error' && (
        <p className="pg-contact-error">{errorMessage}</p>
      )}
    </form>
  )
}
