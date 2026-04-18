'use client'

import { useState, useEffect, type FormEvent } from 'react'

export function ConnectForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Listen for custom event from nav CTA
  useEffect(() => {
    function handleOpen() { setOpen(true) }
    window.addEventListener('open-connect-form', handleOpen)
    return () => window.removeEventListener('open-connect-form', handleOpen)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data: { message: string } = await res.json()

      if (res.ok) {
        setStatus('success')
        setFeedback(data.message)
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
        setFeedback(data.message)
      }
    } catch {
      setStatus('error')
      setFeedback('Something went wrong. Please try again.')
    }
  }

  function handleClose() {
    setOpen(false)
    // Reset after animation
    setTimeout(() => {
      setStatus('idle')
      setFeedback('')
    }, 300)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="pg-connect-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open contact form"
      >
        Let&apos;s Connect
      </button>

      {/* Backdrop */}
      <div
        className={`pg-connect-backdrop${open ? ' pg-connect-backdrop--open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Fly-out panel */}
      <div
        className={`pg-connect-panel${open ? ' pg-connect-panel--open' : ''}`}
        role="dialog"
        aria-modal={open}
        aria-label="Contact form"
      >
        <button className="pg-connect-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="pg-connect-header">
          <h2 className="pg-connect-title">Let&apos;s Connect</h2>
        </div>

        <div className="pg-connect-agents">
          <div className="pg-connect-agent">
            <span className="pg-connect-agent-name">Samantha Porter</span>
            <a href="tel:7739887898" className="pg-connect-agent-detail">773.988.7898</a>
            <a href="mailto:samantha@portergoldberg.com" className="pg-connect-agent-detail">
              samantha@portergoldberg.com
            </a>
          </div>
          <div className="pg-connect-agent">
            <span className="pg-connect-agent-name">Lauren Goldberg</span>
            <a href="tel:7735760053" className="pg-connect-agent-detail">773.576.0053</a>
            <a href="mailto:lauren@portergoldberg.com" className="pg-connect-agent-detail">
              lauren@portergoldberg.com
            </a>
          </div>
        </div>

        {status === 'success' ? (
          <div className="pg-connect-success">
            <p>{feedback}</p>
            <button className="pg-connect-submit" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="pg-connect-form" onSubmit={handleSubmit}>
            <div className="pg-connect-field">
              <label htmlFor="connect-name" className="pg-connect-label">Name</label>
              <input
                id="connect-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pg-connect-input"
                disabled={status === 'loading'}
              />
            </div>

            <div className="pg-connect-field">
              <label htmlFor="connect-email" className="pg-connect-label">Email Address</label>
              <input
                id="connect-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pg-connect-input"
                disabled={status === 'loading'}
              />
            </div>

            <div className="pg-connect-field">
              <label htmlFor="connect-message" className="pg-connect-label">Message</label>
              <textarea
                id="connect-message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pg-connect-input pg-connect-textarea"
                disabled={status === 'loading'}
                placeholder="We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you shortly."
              />
            </div>

            {status === 'error' && (
              <p className="pg-connect-error">{feedback}</p>
            )}

            <button
              type="submit"
              className="pg-connect-submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}

        <p className="pg-connect-office">
          425 W. North Avenue &middot; Chicago, IL 60610<br />
          Jameson Sotheby&apos;s International Realty
        </p>
      </div>
    </>
  )
}
