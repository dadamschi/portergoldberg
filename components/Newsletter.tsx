'use client'

import { useState } from 'react'
import Link from 'next/link'
import { submitConnectForm } from '@/app/actions'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const result = await submitConnectForm({
        name: 'Newsletter Subscriber',
        email,
        message: 'Newsletter subscription request',
        subscribeNewsletter: true,
        addToVendorList: false,
        pageUrl: window.location.href,
      })

      if (result.success) {
        setStatus('success')
        setMessage("You're in! Thanks for subscribing.")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(result.message)
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

        <Link href="/newsletters" className="pg-newsletter-archive-link">
          Browse newsletters →
        </Link>
      </div>
    </section>
  )
}
