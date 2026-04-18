import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Nav, Footer, ConnectForm } from '@/components'
import { NAV_ITEMS } from '@/lib/data'

export const metadata: Metadata = {
  title: {
    default: 'Porter Goldberg Residential',
    template: '%s | Porter Goldberg Residential',
  },
  description: 'Chicago real estate - buying, selling, owning starts here.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-container">
          <Nav items={NAV_ITEMS} />
          <main className="pg-main">
            {children}
          </main>
          <Footer />
        </div>
        <ConnectForm />
      </body>
    </html>
  )
}
