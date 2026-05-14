import type { Metadata } from 'next'
import { fetchVendors } from '@/lib/hubspot'
import { VendorSearch } from '@/components/VendorSearch'

export const metadata: Metadata = {
  title: 'Our Trusted Vendors',
  description: 'A curated list of trusted vendors and service providers recommended by PorterGoldberg Residential.',
}

export const revalidate = 86400 // 24 hours - or use webhook for on-demand

export default async function VendorsPage() {
  const vendors = await fetchVendors()

  return (
    <main className="pg-page">
      <section className="pg-page-hero">
        <h1>Our Trusted Vendors</h1>
        <p>
          Over the years, we&apos;ve built relationships with exceptional service providers across
          Chicago. These are the professionals we trust and recommend to our clients.
        </p>
      </section>

      <VendorSearch vendors={vendors} />
    </main>
  )
}
