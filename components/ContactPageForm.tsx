'use client'

import { useState } from 'react'
import { submitConnectForm } from '@/app/actions'
import { useCaptcha } from '@/lib/useCaptcha'

export function ContactPageForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    addToVendorList: false,
    subscribeNewsletter: true,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const captcha = useCaptcha()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!captcha.isValid) {
      setStatus('error')
      setErrorMessage('Please answer the math question correctly.')
      return
    }

    setStatus('loading')

    try {
      const result = await submitConnectForm(formData)

      if (result.success) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '', addToVendorList: false, subscribeNewsletter: false })
        captcha.reset()
      } else {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form className="pg-contact-form" onSubmit={handleSubmit}>
      <div className="pg-contact-form-row">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="pg-contact-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pg-contact-input"
        />
      </div>
      <textarea
        name="message"
        placeholder="Message"
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="pg-contact-textarea"
      />
      <div className="pg-contact-checkboxes">
        <label className="pg-contact-checkbox">
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
          />
          <span>Subscribe to our newsletter</span>
        </label>
        <label className="pg-contact-checkbox">
          <input
            type="checkbox"
            name="addToVendorList"
            checked={formData.addToVendorList}
            onChange={(e) => setFormData({ ...formData, addToVendorList: e.target.checked })}
          />
          <span>Add me to your vendor list</span>
        </label>
      </div>

      <div className="pg-contact-captcha">
        <label htmlFor="contact-captcha">{captcha.question}</label>
        <input
          id="contact-captcha"
          type="text"
          inputMode="numeric"
          required
          value={captcha.answer}
          onChange={(e) => captcha.setAnswer(e.target.value)}
          className="pg-contact-input pg-contact-captcha-input"
          placeholder="Your answer"
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className="pg-contact-submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : 'Submit'}
      </button>

      {status === 'success' && (
        <p className="pg-contact-success">Thank you! We&apos;ll be in touch soon.</p>
      )}
      {status === 'error' && (
        <p className="pg-contact-error">{errorMessage}</p>
      )}
    </form>
  )
}
