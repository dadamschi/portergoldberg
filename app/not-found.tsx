import { headers } from 'next/headers'
import Link from 'next/link'
import { notify404 } from '@/lib/slack'

export default async function NotFound() {
  const headersList = await headers()
  const referer = headersList.get('referer')
  const pathname = headersList.get('x-pathname') || 'unknown'
  const fullUrl = headersList.get('x-url') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'
  const isRSC = headersList.get('rsc') === '1'
  const isPrefetch = headersList.get('next-router-prefetch') === '1'

  // Skip protocol links (tel:, mailto:, etc.) and common bot probes
  const skipPatterns = [
    /^tel:/,
    /^mailto:/,
    /^javascript:/,
    /\.php$/,
    /wp-admin/,
    /wp-login/,
    /\.env/,
    /^\/terms$/,
    /^\/privacy$/,
    /^\/invest$/,
    /^\/robots\.txt$/,
    /^\/ads\.txt$/,
    /^\/\.well-known/,
    /^\/sitemap/,
    /^\/feed/,
    /^\/rss/,
    /^\/newsletters\//,
    /^\/$/, // Root path edge cases (prefetch/hydration)
  ]
  const shouldSkip = pathname === 'unknown' || skipPatterns.some((pattern) => pattern.test(pathname))

  // Send Slack notification (non-blocking)
  if (!shouldSkip) {
    notify404({ pathname, fullUrl, referer, userAgent, isRSC, isPrefetch }).catch(() => {})
  }

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
