import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Nav, Footer, ConnectForm } from '@/components'
import { NAV_ITEMS } from '@/lib/data'
import { client } from '@/lib/client'
import { AGENTS_QUERY } from '@/lib/queries'
import type { Agent } from '@/types'

export const metadata: Metadata = {
  title: {
    default: 'Porter Goldberg Residential',
    template: '%s | Porter Goldberg Residential',
  },
  description: 'Chicago real estate - buying, selling, owning starts here.',
}

async function getAgents(): Promise<Agent[]> {
  return client.fetch<Agent[]>(AGENTS_QUERY)
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const agents = await getAgents()

  return (
    <html lang="en">
      <body>
        <div className="page-container">
          <Nav items={NAV_ITEMS} />
          <main className="pg-main">
            {children}
          </main>
          <Footer agents={agents} />
        </div>
        <ConnectForm agents={agents} />
      </body>
    </html>
  )
}
