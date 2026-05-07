import { headers } from 'next/headers'
import Link from 'next/link'
import { resend, FROM_EMAIL } from '@/lib/resend'

const ERROR_NOTIFY_EMAIL = process.env.ERROR_NOTIFY_EMAIL || 'dadams.chi@gmail.com'

export default async function NotFound() {
  const headersList = await headers()
  const referer = headersList.get('referer')
  const url = headersList.get('x-url') || headersList.get('x-invoke-path') || 'unknown'

  // Send notification email
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ERROR_NOTIFY_EMAIL,
    subject: `[Porter Goldberg] 404 Not Found`,
    html: `
      <h2>Page Not Found (404)</h2>
      <p><strong>URL:</strong> ${url}</p>
      ${referer ? `<p><strong>Referer:</strong> ${referer}</p>` : ''}
      <hr>
      <p style="color:#666;font-size:12px;">Sent from Porter Goldberg error monitoring</p>
    `,
  }).catch((err) => {
    console.error('[NotFound] Failed to send notification:', err)
  })

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
