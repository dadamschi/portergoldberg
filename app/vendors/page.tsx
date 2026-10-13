import { fetchVendors } from '@/lib/hubspot'
import { VendorSearch, ContentTemplate } from '@/components'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
title: 'Our Trusted Vendors',
  description: 'Curated network of trusted Chicago vendors and service providers. Contractors, designers, inspectors, and specialists recommended by PorterGoldberg.',
  path: '/vendors',
})

export default async function VendorsPage() {
  const vendors = await fetchVendors()
  const title = 'Our Trusted Vendors'
  const heroData = {
    heroHeadline: 'Over the years, we have built trusted relationships with exceptional service providers across Chicago—professionals we confidently recommend',
  }

  return (
    <ContentTemplate
          title={title}
          heroData={heroData}
        >

      <VendorSearch vendors={vendors} />
    </ContentTemplate>
  )
}
