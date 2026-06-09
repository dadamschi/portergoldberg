import { NextResponse } from 'next/server'
import { notifyError, isSlackConfigured } from '@/lib/slack'

type ErrorType = '404' | 'error' | 'global-error'

type ErrorNotifyBody = {
  type: ErrorType
  url: string
  message?: string
  stack?: string
  userAgent?: string
  referer?: string
}

// Errors to ignore (not actionable)
const IGNORED_ERRORS = [
  /Loading chunk \d+ failed/i,           // Deployment cache invalidation
  /ChunkLoadError/i,                      // Same as above
  /Failed to fetch dynamically imported/, // Dynamic import during deploy
  /Network Error/i,                       // Transient network issues
  /Load failed/i,                         // Generic load failures
]

export async function POST(request: Request) {
  if (!isSlackConfigured()) {
    return NextResponse.json({ success: false, reason: 'slack not configured' }, { status: 200 })
  }

  const body: ErrorNotifyBody = await request.json()
  const { type, message } = body

  // 404s are handled directly in not-found.tsx
  if (type === '404') {
    return NextResponse.json({ success: false, reason: '404s handled elsewhere' }, { status: 200 })
  }

  // Skip non-actionable errors
  if (message && IGNORED_ERRORS.some((pattern) => pattern.test(message))) {
    return NextResponse.json({ success: false, reason: 'ignored error type' }, { status: 200 })
  }

  await notifyError({
    type,
    url: body.url,
    message: body.message,
    stack: body.stack,
    userAgent: body.userAgent,
    referer: body.referer,
  })

  return NextResponse.json({ success: true })
}
