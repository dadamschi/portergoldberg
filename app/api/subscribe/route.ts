import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL, NOTIFY_EMAILS } from '@/lib/resend'
import {
  searchContactByEmail,
  updateContactTier,
  createContact,
  addTierValue,
} from '@/lib/hubspot'

async function addToHubSpot(email: string, name?: string): Promise<{ success: boolean; error?: string; updated?: boolean }> {
  const [firstName, ...lastNameParts] = (name || '').split(' ')
  const lastName = lastNameParts.join(' ')

  const result = await createContact(email, firstName || '', lastName, 'Newsletter;Warm')

  if (result.success) {
    return { success: true }
  }

  // 409 = contact already exists, try to update their tier
  if (result.conflict) {
    const existingContact = await searchContactByEmail(email)
    if (existingContact) {
      const newTier = addTierValue(existingContact.tier, 'Newsletter')
      if (newTier !== existingContact.tier) {
        const updated = await updateContactTier(existingContact.id, newTier)
        return { success: true, updated }
      }
      return { success: true, updated: false } // Already had Newsletter
    }
    return { success: true } // Couldn't find to update, but contact exists
  }

  return { success: false, error: result.error }
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
  let hubspotResult: { success: boolean; error?: string }
  try {
    hubspotResult = await addToHubSpot(email, name)
    if (hubspotResult.success) {
      console.log(`[HubSpot] Successfully added contact: ${email}`)
    } else {
      console.error(`[HubSpot] Failed to add contact: ${hubspotResult.error}`)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[HubSpot] Error: ${errorMessage}`)
    hubspotResult = { success: false, error: errorMessage }
  }

  // Send notification email as backup/notification
  const isProduction = process.env.VERCEL_ENV === 'production'
  const subject = isProduction
    ? 'New Newsletter Subscriber - PorterGoldberg'
    : 'PREVIEW - New Newsletter Subscriber - PorterGoldberg'

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAILS,
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
