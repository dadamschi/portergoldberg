import Image from 'next/image'
import Link from 'next/link'
import type { Agent } from '@/types'

type FooterProps = {
  agents: Agent[]
}

const DISCLAIMER = `© 2026 Sotheby's International Realty® and the Sotheby's International Realty Logo are service marks licensed to Sotheby's International Realty Affiliates LLC and used with permission. Jameson Sotheby's International Realty fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated. Any services or products provided by independently owned and operated franchisees are not provided by, affiliated with or related to Sotheby's International Realty Affiliates LLC nor any of its affiliated companies.`

function AgentCard({ agent, align }: { agent: Agent; align: 'left' | 'right' }) {
  const isLeft = align === 'left'

  return (
    <div className={`pg-footer-agent-card ${isLeft ? 'pg-footer-agent-card--left' : 'pg-footer-agent-card--right'}`}>
      <div className={`pg-footer-agent-info ${isLeft ? 'pg-footer-agent-info--left' : 'pg-footer-agent-info--right'}`}>
        <h3 className="pg-footer-agent-name">{agent.name.toUpperCase()}</h3>
        <p className="pg-footer-agent-title">Vice President, Sales</p>
        <p className="pg-footer-agent-phone">{agent.phone}</p>
        <a href={`mailto:${agent.email}`} className="pg-footer-agent-email">
          {agent.email}
        </a>
      </div>
    </div>
  )
}

export function FooterNew({ agents }: FooterProps) {
  const [samantha, lauren] = agents

  return (
    <footer className="pg-footer-new">
      {/* Top white banner with URL */}
      <div className="pg-footer-top">
        <div className="pg-footer-top-line" />
        <span className="pg-footer-top-url">PORTERGOLDBERG.COM</span>
        <div className="pg-footer-top-line" />
      </div>

      {/* Black section with agents */}
      <div className="pg-footer-main">
        <div className="pg-footer-agents">
          {samantha && <AgentCard agent={samantha} align="left" />}
          {lauren && <AgentCard agent={lauren} align="right" />}
        </div>

        {/* Logos and social */}
        <div className="pg-footer-brand-row">
          <div className="pg-footer-logos">
            <Image
              src="/PGRR_Logo_VerticalwithJ.png"
              alt="Porter Goldberg Residential - Jameson Sotheby's International Realty"
              width={180}
              height={80}
              className="pg-footer-logo-pg"
            />
          </div>

          <div className="pg-footer-social">
            <Link
              href="https://www.instagram.com/portergoldbergchicago"
              target="_blank"
              rel="noopener noreferrer"
              className="pg-footer-social-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @portergoldbergchicago
            </Link>
            <Link
              href="https://www.facebook.com/PorterGoldbergResidential"
              target="_blank"
              rel="noopener noreferrer"
              className="pg-footer-social-link"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Porter Goldberg Residential
            </Link>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="pg-footer-legal">
          <p>{DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  )
}
