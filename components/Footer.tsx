import Image from 'next/image'

type FooterAgent = {
  name: string
  phone: string
  email: string
}

type FooterProps = {
  agents?: FooterAgent[]
}

const DEFAULT_AGENTS: FooterAgent[] = [
  {
    name: 'Samantha Porter',
    phone: '773.988.7898',
    email: 'samantha@portergoldberg.com',
  },
  {
    name: 'Lauren Goldberg',
    phone: '773.576.0053',
    email: 'lauren@portergoldberg.com',
  },
]

const DISCLAIMER = `Sotheby's International Realty and the Sotheby's International Realty logo are registered (or unregistered) service marks used with permission. Sotheby's International Realty Affiliates LLC fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each Office Is Independently Owned And Operated.`

export function Footer({ agents = DEFAULT_AGENTS }: FooterProps) {
  const [samantha, lauren] = agents

  return (
    <footer className="pg-footer">
      {/* Row 1: Agent contacts + PG logo */}
      <div className="pg-footer-contacts">
        {/* Samantha */}
        <div className="pg-footer-agent">
          <h3 className="pg-footer-agent-name">{samantha?.name}</h3>
          <div className="pg-footer-agent-phone">{samantha?.phone}</div>
          <a href={`mailto:${samantha?.email}`} className="pg-footer-agent-email">
            {samantha?.email}
          </a>
        </div>

        {/* Center logo */}
        <div className="pg-footer-logo-center">
          <Image
            src="/cropped-PorterGoldberg.png"
            alt="Porter Goldberg"
            width={150}
            height={150}
          />
        </div>

        {/* Lauren */}
        <div className="pg-footer-agent">
          <h3 className="pg-footer-agent-name">{lauren?.name}</h3>
          <div className="pg-footer-agent-phone">{lauren?.phone}</div>
          <a href={`mailto:${lauren?.email}`} className="pg-footer-agent-email">
            {lauren?.email}
          </a>
        </div>
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
