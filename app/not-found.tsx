import { headers } from 'next/headers'
import Link from 'next/link'
import { createIssue, findExistingIssue, addCommentToIssue, isGitHubConfigured } from '@/lib/github'

export default async function NotFound() {
  const headersList = await headers()
  const referer = headersList.get('referer')
  const pathname = headersList.get('x-pathname') || 'unknown'

  // Create GitHub issue for 404 (only if configured)
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
  ]
  const shouldSkip = skipPatterns.some((pattern) => pattern.test(pathname))

  if (isGitHubConfigured() && !shouldSkip) {
    const title = `404: ${pathname}`
    const existingIssue = await findExistingIssue(title)

    if (existingIssue) {
      await addCommentToIssue(
        existingIssue.number,
        `**Occurred again at ${new Date().toISOString()}**\n\n- Referer: ${referer || 'none'}`
      )
    } else {
      await createIssue({
        title,
        body: `## Page Not Found (404)\n\n| Field | Value |\n|-------|-------|\n| **URL** | ${pathname} |\n| **Referer** | ${referer || 'none'} |\n| **Timestamp** | ${new Date().toISOString()} |`,
        labels: ['bug/404'],
      }).catch((err) => {
        console.error('[NotFound] Failed to create issue:', err)
      })
    }
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
