import { Metadata } from 'next'
import ReviewLinkGenerator from '@/components/ReviewLinkGenerator'

export const metadata: Metadata = {
  title: 'Generate Review Links | PorterGoldberg',
  robots: 'noindex, nofollow',
}

export default function ReviewLinksPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>Generate Review Links</h1>
      <ReviewLinkGenerator />
    </div>
  )
}
