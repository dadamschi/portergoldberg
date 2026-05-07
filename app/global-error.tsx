'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Send error notification
    fetch('/api/error-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'global-error',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        message: error.message,
        stack: error.stack,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      }),
    }).catch((err) => {
      console.error('[GlobalError] Failed to send notification:', err)
    })

    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html>
      <body>
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-xl text-gray-600 mb-8">Something went wrong</p>
            <button
              onClick={reset}
              className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
