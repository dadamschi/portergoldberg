'use client'

import { useState, type FormEvent } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data: { message: string } = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="pg-newsletter">
      <div className="pg-newsletter-inner">
        <h2 className="pg-newsletter-title">Stay in the Know</h2>
        <p className="pg-newsletter-desc">
          Market insights, new listings, and neighborhood updates — delivered to your inbox.
        </p>

        {status === 'success' ? (
          <p className="pg-newsletter-success">{message}</p>
        ) : (
          <form className="pg-newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pg-newsletter-input"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="pg-newsletter-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="pg-newsletter-error">{message}</p>
        )}
      </div>
    </section>
  )
}
