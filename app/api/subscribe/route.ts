import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { EMAIL_NOTIFICATION_RECIPIENTS } from '@/lib/constants'

export async function POST(request: Request) {
  const body: { email?: string; name?: string } = await request.json()
  const { email, name } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  // Try to add contact to HubSpot
  let hubspotResult: { success: boolean; error?: string }
  try {
    // const result = await addNewsletterToContactByEmail(email)
    const result = true
    if(!result) {
      hubspotResult = { success: false, error: 'Failed to add contact to HubSpot' }
    }
    hubspotResult = { success: true }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[HubSpot] Error: ${errorMessage}`)
    hubspotResult = { success: false, error: errorMessage }
  }

  // Send notification email
  const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''
  const fromEmail = `"PorterGoldberg Website" <${fromAddress}>`
  const recipients = EMAIL_NOTIFICATION_RECIPIENTS

  const { error } = await sendEmail({
    from: fromEmail,
    to: recipients,
    subject: 'New Newsletter Subscriber',
    html: `
      <h2>New Newsletter Subscriber</h2>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr>
      <p><strong>HubSpot Status:</strong> ${hubspotResult.success ? 'Added successfully' : `Failed - ${hubspotResult.error}`}</p>
    `,
  })

  if (error) {
    console.error('[Newsletter] Failed to send notification:', error)
  }

  return NextResponse.json(
    { message: "You're in! Thanks for subscribing." },
    { status: 200 },
  )
}
