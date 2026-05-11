import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(request: Request) {
  const body: { email?: string; name?: string } = await request.json()
  const { email, name } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  // Send notification to add subscriber to HubSpot
  const isProduction = process.env.VERCEL_ENV === 'production'
  const notifyEmails = isProduction
    ? ['dadams.chi+portergoldbergcc@gmail.com', 'contact@artplexity.com']
    : ['dadams.chi+portergoldbergcc@gmail.com']
  let subject = 'New Newsletter Subscriber - Porter Goldberg'
  
  subject = isProduction
    ? "PREVIEW - " + subject
    : subject

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: notifyEmails,
    subject: `${subject}`,
    html: `
      <h2>New Newsletter Subscriber</h2>
      <p>Please add this person to the HubSpot newsletter list:</p>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email}</p>
    `,
  })

  if (error) {
    console.error('[Newsletter] Failed to send notification:', error)
  }

  console.log(`[Newsletter] New subscriber: ${email}`)

  return NextResponse.json(
    { message: "You're in! Thanks for subscribing." },
    { status: 200 },
  )
}
