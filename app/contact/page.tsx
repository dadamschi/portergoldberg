'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // TODO: Wire up to email service
    console.log('Contact form submitted:', formData)

    // Simulate success for now
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    }, 1000)
  }

  return (
    <section className="pg-contact-page">
      <div className="pg-contact-row">
        <div className="pg-contact-col-empty" />

        <div className="pg-contact-col-content">
          <h2 className="pg-contact-title">
            <strong>Let&apos;s Connect</strong>
          </h2>

          <div className="pg-contact-agents">
            <div className="pg-contact-agent">
              <p>
                <strong>Samantha Porter</strong>
                <br />
                Broker Associate
                <br />
                <a href="tel:773-988-7898">773-988-7898</a>
                <br />
                <a href="mailto:samantha@portergoldberg.com">
                  samantha@portergoldberg.com
                </a>
              </p>
            </div>

            <div className="pg-contact-agent">
              <p>
                <strong>Lauren Goldberg</strong>
                <br />
                Broker Associate
                <br />
                <a href="tel:773-576-0053">773-576-0053</a>
                <br />
                <a href="mailto:lauren@portergoldberg.com">
                  lauren@portergoldberg.com
                </a>
              </p>
            </div>
          </div>

          <div className="pg-contact-address">
            <strong>Jameson Sotheby&apos;s International Realty</strong>
            <br />
            425 W. North Avenue | Chicago, IL 60610
          </div>
          
          <div className="pg-contact-social">
            <a
              href="https://www.facebook.com/portergoldbergresidential/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="56" height="56" fill="currentColor">
                <rect width="24" height="24" rx="4" fill="#1877F2" />
                <path
                  d="M16.5 12.5h-2.5v8h-3v-8H9v-2.5h2v-1.8c0-2 1.2-3.2 3-3.2.9 0 1.7.1 1.7.1v2h-1c-1 0-1.2.5-1.2 1.1v1.8h2.2l-.2 2.5z"
                  fill="#fff"
                />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/portergoldbergchicago/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="56" height="56">
                <defs>
                  <linearGradient id="ig-grad-contact" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#feda75" />
                    <stop offset="25%" stopColor="#fa7e1e" />
                    <stop offset="50%" stopColor="#d62976" />
                    <stop offset="75%" stopColor="#962fbf" />
                    <stop offset="100%" stopColor="#4f5bd5" />
                  </linearGradient>
                </defs>
                <rect width="24" height="24" rx="4" fill="url(#ig-grad-contact)" />
                <rect
                  x="5.5"
                  y="5.5"
                  width="13"
                  height="13"
                  rx="3.5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.5" fill="none" />
                <circle cx="16.2" cy="7.8" r="1" fill="#fff" />
              </svg>
            </a>
          </div>
{/* 
          <div className="pg-contact-brand">
            <Image
              src="/PGRR_Logo_VerticalwithJ.png"
              alt="Porter Goldberg Residential - Jameson Sotheby's International Realty"
              width={300}
              height={165}
              className="pg-contact-brand-logo"
            />
          </div> */}

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
              <p className="pg-contact-error">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
