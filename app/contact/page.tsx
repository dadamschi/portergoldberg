import type { Metadata } from 'next'
import { client } from '@/lib/client'
import { AGENTS_QUERY } from '@/lib/queries'
import { ContactForm } from '@/components'
import type { Agent } from '@/types'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Porter Goldberg Residential — Chicago real estate experts.',
}

export const revalidate = 86400

async function getAgents(): Promise<Agent[]> {
  return client.fetch<Agent[]>(AGENTS_QUERY)
}

export default async function ContactPage() {
  const agents = await getAgents()

  return <ContactForm agents={agents} />
}
