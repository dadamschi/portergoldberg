import type { Metadata } from 'next'
import { BulkEmailSender } from '@/components/BulkEmailSender'

export const metadata: Metadata = {
  title: 'Bulk Email Sender | PorterGoldberg',
  description: 'Send bulk emails to HubSpot list contacts',
  robots: 'noindex, nofollow',
}

export default function BulkEmailPage() {
  return (
    <main className="pg-page">
      <section className="pg-page-hero">
        <h1>Bulk Email Sender</h1>
        <p>Send personalized emails to contacts from HubSpot lists. This is NOT meant for bulk marketing.</p>
      </section>

      <section className="pg-section">
        <div className="pg-container">
          <BulkEmailSender />
        </div>
      </section>
    </main>
  )
}
