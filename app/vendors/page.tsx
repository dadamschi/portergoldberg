import type { Metadata } from 'next'
import { VENDORS } from '@/lib/data'
import { VendorSearch } from '@/components/VendorSearch'

export const metadata: Metadata = {
  title: 'Our Trusted Vendors',
  description: 'A curated list of trusted vendors and service providers recommended by Porter Goldberg Residential.',
}

export default function VendorsPage() {
  return (
    <main className="pg-vendors-page">
      <section className="pg-vendors-hero">
        <h1>Our Trusted Vendors</h1>
        <p>
          Over the years, we&apos;ve built relationships with exceptional service providers across
          Chicago. These are the professionals we trust and recommend to our clients.
        </p>
      </section>

      <VendorSearch vendors={VENDORS} />
    </main>
  )
}
