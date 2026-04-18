import '@/styles/globals.css'
import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}
