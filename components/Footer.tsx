import Image from 'next/image'
import type { Agent } from '@/types'

type FooterProps = {
  agents: Agent[]
}

const DISCLAIMER = `Sotheby's International Realty and the Sotheby's International Realty logo are registered (or unregistered) service marks used with permission. Sotheby's International Realty Affiliates LLC fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each Office Is Independently Owned And Operated.`

export function Footer({ agents }: FooterProps) {
  const [firstAgent, secondAgent] = agents

  return (
    <footer className="pg-footer">
      {/* Row 1: Agent contacts + PG logo */}
      <div className="pg-footer-contacts">
        {firstAgent && (
          <div className="pg-footer-agent">
            <h3 className="pg-footer-agent-name">{firstAgent.name}</h3>
            <div className="pg-footer-agent-phone">{firstAgent.phone}</div>
            <a href={`mailto:${firstAgent.email}`} className="pg-footer-agent-email">
              {firstAgent.email}
            </a>
          </div>
        )}

        {/* Center logo */}
        <div className="pg-footer-logo-center">
          <Image
            src="/cropped-PorterGoldberg.png"
            alt="Porter Goldberg"
            width={150}
            height={150}
          />
        </div>

        {secondAgent && (
          <div className="pg-footer-agent">
            <h3 className="pg-footer-agent-name">{secondAgent.name}</h3>
            <div className="pg-footer-agent-phone">{secondAgent.phone}</div>
            <a href={`mailto:${secondAgent.email}`} className="pg-footer-agent-email">
              {secondAgent.email}
            </a>
          </div>
        )}
      </div>

      {/* Row 2: Full logo with Jameson Sotheby's */}
      <div className="pg-footer-brand">
        <Image
          src="/PGRR_Logo_VerticalwithJ.png"
          alt="Porter Goldberg Residential - Jameson Sotheby's International Realty"
          width={400}
          height={220}
          className="pg-footer-brand-logo"
        />
      </div>

      {/* Row 3: Legal disclaimer */}
      <div className="pg-footer-legal">
        <p>{DISCLAIMER}</p>
      </div>
    </footer>
  )
}
