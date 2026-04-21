import type { Agent } from '@/types'
import { ContactPageForm } from './ContactPageForm'
import { SocialLinks } from './SocialLinks'

type ContactFormProps = {
  agents: Agent[]
}

export function ContactForm({ agents }: ContactFormProps) {
  return (
    <section className="pg-contact-page">
      <div className="pg-contact-row">
        <div className="pg-contact-col-empty" />

        <div className="pg-contact-col-content">
          <h2 className="pg-contact-title">
            <strong>Let&apos;s Connect</strong>
          </h2>

          <div className="pg-contact-agents">
            {agents.map((agent) => (
              <div key={agent._id} className="pg-contact-agent">
                <p>
                  <strong>{agent.name}</strong>
                  <br />
                  Broker Associate
                  <br />
                  <a href={`tel:${agent.phone.replace(/\D/g, '')}`}>{agent.phone}</a>
                  <br />
                  <a href={`mailto:${agent.email}`}>{agent.email}</a>
                </p>
              </div>
            ))}
          </div>

          <div className="pg-contact-address">
            <strong>Jameson Sotheby&apos;s International Realty</strong>
            <br />
            425 W. North Avenue | Chicago, IL 60610
          </div>

          <SocialLinks className="pg-contact-social" />

          <ContactPageForm />
        </div>
      </div>
    </section>
  )
}
