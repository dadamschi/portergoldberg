'use client'

import type { Agent } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

type AgentCardProps = {
  agent: Agent
  href?: string
  title?: string
  cta?: string
  openContactForm?: boolean
}

export function AgentCard({
  agent,
  href,
  title = 'Contact Us about listings',
  cta = 'Send Message',
  openContactForm = false
}: AgentCardProps) {

  function handleClick(e: React.MouseEvent) {
    if (openContactForm) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('open-connect-form'))
    }
  }

  const content = (
    <div className="pg-agent-card-compact">
      <div className="pg-agent-card-compact-photo" style={{ position: 'relative' }}>
        <Image
          src={agent.photo?.asset?.url ?? '/PorterGoldberg-Residential.webp'}
          alt={agent.photo?.alt ?? agent.name}
          className="pg-agent-card-compact-img"
          fill
          sizes="75vw"
        />
      </div>
      <div className="pg-agent-card-compact-info">
        <span className="pg-agent-card-compact-name">{title}</span>
        <span className="pg-agent-card-compact-cta">
          {cta}
          <svg
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            aria-hidden="true"
            className="pg-agent-card-compact-arrow"
          >
            <path
              d="M1 6h17M13 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  )

  if (openContactForm) {
    return (
      <button className="pg-agent-card-link" onClick={handleClick} type="button">
        {content}
      </button>
    )
  }

  return (
    <Link href={href ?? '/contact'} className="pg-agent-card-link">
      {content}
    </Link>
  )
}
