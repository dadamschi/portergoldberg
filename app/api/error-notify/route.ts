import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL, NOTIFY_EMAILS } from '@/lib/resend'

type ErrorNotifyBody = {
  type: '404' | 'error' | 'global-error'
  url: string
  message?: string
  stack?: string
  userAgent?: string
  referer?: string
}

export async function POST(request: Request) {
  if (!resend) {
    console.warn('[ErrorNotify] Resend not configured, skipping email')
    return NextResponse.json({ success: false, reason: 'email not configured' }, { status: 200 })
  }

  const body: ErrorNotifyBody = await request.json()
  const { type, url, message, stack, userAgent, referer } = body

  const subjectMap = {
    '404': `404 Not Found: ${url}`,
    'error': `Runtime Error on ${url}`,
    'global-error': `Global Error on ${url}`,
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAILS,
    subject: `[Porter Goldberg] ${subjectMap[type]}`,
    html: `
      <h2>${type === '404' ? 'Page Not Found' : 'Error Occurred'}</h2>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>URL:</strong> ${url}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      ${referer ? `<p><strong>Referer:</strong> ${referer}</p>` : ''}
      ${userAgent ? `<p><strong>User Agent:</strong> ${userAgent}</p>` : ''}
      ${stack ? `<pre style="background:#f4f4f4;padding:12px;overflow:auto;font-size:12px;">${stack}</pre>` : ''}
      <hr>
      <p style="color:#666;font-size:12px;">Sent from Porter Goldberg error monitoring</p>
    `,
  })

  if (error) {
    console.error('[ErrorNotify] Failed to send:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
