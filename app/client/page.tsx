'use client'

import { useState } from 'react'
import { submitTestForm } from '@/app/actions'
import { useCaptcha } from '@/lib/useCaptcha'

export default function TestEmailPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<{ message: string; sentTo?: string } | null>(null)
  const captcha = useCaptcha()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captcha.isValid) {
      setStatus('error')
      setResult({ message: 'Please answer the math question correctly.' })
      return
    }

    setStatus('loading')

    try {
      const response = await submitTestForm(formData)

      if (response.success) {
        setStatus('success')
        setResult({ message: response.message, sentTo: response.sentTo })
        setFormData({ name: '', email: '', message: '' })
        captcha.reset()
      } else {
        setStatus('error')
        setResult({ message: response.message })
      }
    } catch (err) {
      setStatus('error')
      setResult({ message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  return (
    <main className="pg-contact-page" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Email Test Page</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          This form sends a test email to the address configured in TEST_EMAIL_RECIPIENT.
          No portergoldberg.com addresses are used.
        </p>

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

          <div className="pg-contact-captcha">
            <label htmlFor="test-captcha">{captcha.question}</label>
            <input
              id="test-captcha"
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
            {status === 'loading' ? 'Sending...' : 'Send Test Email'}
          </button>

          {status === 'success' && result && (
            <div className="pg-contact-success">
              <p>{result.message}</p>
              {result.sentTo && (
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Sent to: {result.sentTo}
                </p>
              )}
            </div>
          )}
          {status === 'error' && result && (
            <p className="pg-contact-error">{result.message}</p>
          )}
        </form>
      </div>
    </main>
  )
}
