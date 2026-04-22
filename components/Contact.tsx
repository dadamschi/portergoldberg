'use client'

import { useState } from 'react'
import type { Agent } from '@/types'

function AgentCard({ agent }: { agent: Agent }) {
  const bgStyle = agent.photo?.asset?.url
    ? { backgroundImage: `url(${agent.photo.asset.url})`, backgroundSize: 'cover' }
    : { backgroundColor: agent.fallbackColor ?? '#2C3E35' }

  return (
    <div className="pg-agent">
      <div className="pg-agent-avatar" style={bgStyle}>
        {!agent.photo?.asset?.url && agent.initials}
      </div>
      <div>
        <div className="pg-agent-name">{agent.name}</div>
        <div className="pg-agent-phone">
          <a href={`tel:${agent.phone.replace(/\./g, '')}`}>{agent.phone}</a>
        </div>
        <div className="pg-agent-email">
          <a href={`mailto:${agent.email}`}>{agent.email}</a>
        </div>
      </div>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    // TODO: Wire up to form handler (e.g. Resend, Formspree, or API route)
    console.log('Form submitted:', form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ paddingTop: '16px' }}>
        <p style={{ fontSize: '14px', color: 'var(--pg-mid)', lineHeight: 1.7 }}>
          Thank you — we'll be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <form className="pg-contact-form" onSubmit={handleSubmit} noValidate>
      <input
        className="pg-input"
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        autoComplete="name"
      />
      <input
        className="pg-input"
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />
      <input
        className="pg-input"
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        autoComplete="tel"
      />
      <textarea
        className="pg-input pg-textarea"
        name="message"
        placeholder="Tell us about your real estate goals..."
        value={form.message}
        onChange={handleChange}
        rows={5}
      />
      <button type="submit" className="pg-submit">
        Send Message
      </button>
    </form>
  )
}

type ContactProps = {
  agents: Agent[]
  headline?: string
}

export function Contact({ agents, headline = "Let's Connect" }: ContactProps) {
  return (
    <section className="pg-contact" id="contact">
      {/* Agents */}
      <div>
        <p className="pg-section-label">The Team</p>
        <h2 className="pg-section-title">
          Meet the Team
        </h2>
        <div className="pg-agents">
          {agents.map((agent) => (
            <AgentCard key={agent._id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Form */}
      <div>
        <h2 className="pg-section-title">{headline}</h2>
        <ContactForm />
      </div>
    </section>
  )
}
