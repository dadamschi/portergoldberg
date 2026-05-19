import Image from 'next/image'
import Link from 'next/link'
import type { Agent } from '@/types'
import { InstagramIcon, FacebookIcon, YouTubeIcon, SOCIAL_URLS } from './SocialLinks'

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

export function Footer({ agents }: FooterProps) {
  const [samantha, lauren] = agents

  return (
    <footer className="pg-footer-new">
      {/* Black section with agents */}
      <div className="pg-footer-main">
        <div className="pg-footer-agents">
          {samantha && <AgentCard agent={samantha} align="left" />}
          {lauren && <AgentCard agent={lauren} align="right" />}
        </div>

        {/* Logo and social */}
        <div className="pg-footer-brand-row">
          <Image
            src="/PorterGoldberg-Residential.webp"
            alt="Porter Goldberg Residential"
            width={160}
            height={28}
            className="pg-footer-logo"
          />

          <div className="pg-footer-social">
            <Link
              href={SOCIAL_URLS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-footer-social-link"
            >
              <InstagramIcon size={20} mono />
              @portergoldbergchicago
            </Link>
            <Link
              href={SOCIAL_URLS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-footer-social-link"
            >
              <FacebookIcon size={20} mono />
              PorterGoldberg Residential
            </Link>
            <Link
              href={SOCIAL_URLS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-footer-social-link"
            >
              <YouTubeIcon size={20} mono />
              @PorterGoldbergResidential
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
