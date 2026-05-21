import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import { Nav, Footer, ConnectForm, NewsletterToast } from '@/components'
import { LocalBusinessJsonLd, WebsiteJsonLd } from '@/components/JsonLd'
import { NAV_ITEMS } from '@/lib/data'
import { client } from '@/lib/client'
import { AGENTS_QUERY, RECENT_NEWSLETTER_QUERY } from '@/lib/queries'
import type { Agent } from '@/types'

const siteUrl = 'https://portergoldberg.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'PorterGoldberg Residential | Chicago Real Estate Experts',
    template: '%s | PorterGoldberg Residential',
  },
  description: 'Samantha Porter & Lauren Goldberg — boutique Chicago real estate expertise for buying, selling, and building. Jameson Sotheby\'s International Realty.',
  keywords: ['Chicago real estate', 'Chicago realtor', 'luxury homes Chicago', 'Lincoln Park real estate', 'North Side Chicago homes', 'Jameson Sotheby\'s'],
  authors: [{ name: 'PorterGoldberg Residential' }],
  creator: 'PorterGoldberg Residential',
  publisher: 'PorterGoldberg Residential',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'PorterGoldberg Residential',
    title: 'PorterGoldberg Residential | Chicago Real Estate Experts',
    description: 'Samantha Porter & Lauren Goldberg — boutique Chicago real estate expertise for buying, selling, and building.',
    images: [
      {
        url: '/PorterGoldberg-Residential.webp',
        width: 1200,
        height: 630,
        alt: 'PorterGoldberg Residential',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PorterGoldberg Residential | Chicago Real Estate',
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
  verification: {
    google: '5xjymRUSMxoa9ROBZMjOEvvMEWMyOgXeMEpjhn_oVAE',
  },
}

type RecentNewsletter = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
} | null

async function getAgents(): Promise<Agent[]> {
  return client.fetch<Agent[]>(AGENTS_QUERY)
}

async function getRecentNewsletter(): Promise<RecentNewsletter> {
  const cutoffDate = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString().split('T')[0]
  return client.fetch<RecentNewsletter>(RECENT_NEWSLETTER_QUERY, { cutoffDate })
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [agents, recentNewsletter] = await Promise.all([
    getAgents(),
    getRecentNewsletter(),
  ])

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
        <Suspense fallback={null}>
          <ConnectForm agents={agents} />
        </Suspense>

        {recentNewsletter && <NewsletterToast newsletter={recentNewsletter} />}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JXKWK4V7GW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JXKWK4V7GW');
          `}
        </Script>
      </body>
    </html>
  )
}
