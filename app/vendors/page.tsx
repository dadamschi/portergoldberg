import { fetchVendors } from '@/lib/hubspot'
import { VendorSearch, ContentTemplate } from '@/components'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
title: 'Our Trusted Vendors',
  description: 'A curated list of trusted vendors and service providers recommended by PorterGoldberg Residential',
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
