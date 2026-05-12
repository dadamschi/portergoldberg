import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/resend'

async function addToHubSpot(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) {
    return { success: false, error: 'HubSpot API key not configured' }
  }

  const [firstName, ...lastNameParts] = (name || '').split(' ')
  const lastName = lastNameParts.join(' ')

  const response = await fetch('https://api.hubapi.com/crm/objects/2026-03/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email,
        firstname: firstName || '',
        lastname: lastName || '',
        lifecyclestage: 'subscriber',
        tier: 'Newsletter;Warm',
      },
    }),
  })

  if (!response.ok) {
    // 409 = contact already exists, which is fine
    if (response.status === 409) {
      return { success: true }
    }
    const errorData = await response.json()
    return { success: false, error: errorData.message || `HTTP ${response.status}` }
  }

  return { success: true }
}

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
  const hubspotResult = await addToHubSpot(email, name)
  if (hubspotResult.success) {
    console.log(`[HubSpot] Successfully added contact: ${email}`)
  } else {
    console.error(`[HubSpot] Failed to add contact: ${hubspotResult.error}`)
  }

  // Send notification email as backup/notification
  const isProduction = process.env.VERCEL_ENV === 'production'
  const notifyEmails = isProduction
    ? ['dadams.chi+portergoldbergcc@gmail.com', 'contact@artplexity.com']
    : ['dadams.chi+portergoldbergcc@gmail.com']
  let subject = 'New Newsletter Subscriber - Porter Goldberg'

  subject = isProduction
    ? subject
    : "PREVIEW - " + subject

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: notifyEmails,
    subject: `${subject}`,
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

  console.log(`[Newsletter] New subscriber: ${email}`)

  return NextResponse.json(
    { message: "You're in! Thanks for subscribing." },
    { status: 200 },
  )
}
