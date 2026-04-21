import type { Metadata } from 'next'
import Image from 'next/image'
import { client } from '@/lib/client'
import { AGENTS_QUERY } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import type { Agent } from '@/types'
import { portableTextComponents } from '@/lib/portableText'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet Samantha Porter and Lauren Goldberg — Chicago real estate experts at Jameson Sotheby\'s International Realty.',
}

export const revalidate = 3600

async function getAgents(): Promise<Agent[]> {
  return client.fetch<Agent[]>(AGENTS_QUERY)
}

function AgentSection({ agent, reversed = false }: { agent: Agent; reversed?: boolean }) {
  const initials = agent.initials || agent.name.split(' ').map(n => n[0]).join('')

  const photoContent = agent.photo?.asset?.url ? (
    <Image
      src={agent.photo.asset.url}
      alt={agent.name}
      width={400}
      height={500}
      className="pg-agent-image"
    />
  ) : (
    <div
      className="pg-agent-photo-placeholder"
      style={{ backgroundColor: agent.fallbackColor || '#2C3E35' }}
    >
      <span className="pg-agent-initials">{initials}</span>
    </div>
  )

  const bioContent = (
    <div className="pg-agent-bio">
      <span className="pg-agent-name" style={{ fontWeight: '800' }}>{agent.name}</span>
      {agent.bio?.biography && (
        <PortableText value={agent.bio.biography} components={portableTextComponents} />
      )}
    </div>
  )

  return (
    <section className={`pg-agent-section${reversed ? ' pg-agent-section--reversed' : ''}`}>
      {reversed ? (
        <>
          {bioContent}
          <div className="pg-agent-photo">{photoContent}</div>
        </>
      ) : (
        <>
          <div className="pg-agent-photo">{photoContent}</div>
          {bioContent}
        </>
      )}
    </section>
  )
}

function PartnershipSection() {
  return (
    <section className="pg-partnership" style= {{ backgroundColor: '#666666'}}>
      <div className="pg-partnership-inner">
        <h3 className="pg-partnership-quote">
          <strong>Samantha</strong> and <strong>Lauren</strong> are Chicago natives, moms with
          two young children, and have husbands in construction. With kids in public and private
          schools, involvement in community, and a great knowledge of the real estate
          culture&hellip; they are a distinguishable resource.
        </h3>
      </div>
    </section>
  )
}

export default async function AboutPage() {
  const agents = await getAgents()

  return (
    <main className="pg-about-page">
      {agents.map((agent, index) => (
        <div key={agent._id}>
          <AgentSection agent={agent} reversed={index % 2 === 1} />
          {index === 0 && <PartnershipSection />}
        </div>
      ))}
    </main>
  )
}
