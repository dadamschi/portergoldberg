import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Nav, Footer, ConnectForm } from '@/components'
import { LocalBusinessJsonLd, WebsiteJsonLd } from '@/components/JsonLd'
import { NAV_ITEMS } from '@/lib/data'
import { client } from '@/lib/client'
import { AGENTS_QUERY } from '@/lib/queries'
import type { Agent } from '@/types'

const siteUrl = 'https://portergoldberg.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Porter Goldberg Residential | Chicago Real Estate Experts',
    template: '%s | Porter Goldberg Residential',
  },
  description: 'Samantha Porter & Lauren Goldberg — boutique Chicago real estate expertise for buying, selling, and building. Jameson Sotheby\'s International Realty.',
  keywords: ['Chicago real estate', 'Chicago realtor', 'luxury homes Chicago', 'Lincoln Park real estate', 'North Side Chicago homes', 'Jameson Sotheby\'s'],
  authors: [{ name: 'Porter Goldberg Residential' }],
  creator: 'Porter Goldberg Residential',
  publisher: 'Porter Goldberg Residential',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Porter Goldberg Residential',
    title: 'Porter Goldberg Residential | Chicago Real Estate Experts',
    description: 'Samantha Porter & Lauren Goldberg — boutique Chicago real estate expertise for buying, selling, and building.',
    images: [
      {
        url: '/PorterGoldberg-Residential.webp',
        width: 1200,
        height: 630,
        alt: 'Porter Goldberg Residential',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porter Goldberg Residential | Chicago Real Estate',
    description: 'Boutique Chicago real estate expertise for buying, selling, and building.',
    images: ['/PorterGoldberg-Residential.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
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
      <head>
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
      </head>
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
