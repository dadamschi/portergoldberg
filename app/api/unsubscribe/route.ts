import { NextResponse } from 'next/server'
import {
  searchContactByEmail,
  updateContactTier,
  removeTierValue,
} from '@/lib/hubspot'

async function removeFromHubSpotNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const contact = await searchContactByEmail(email)
  if (!contact) {
    return { success: false, error: 'Contact not found' }
  }

  const newTier = removeTierValue(contact.tier, 'Newsletter')
  if (newTier === contact.tier) {
    return { success: true } // Already unsubscribed
  }

  const updated = await updateContactTier(contact.id, newTier)
  if (!updated) {
    return { success: false, error: 'Failed to update contact' }
  }

  return { success: true }
}

export async function POST(request: Request) {
  const body: { email?: string } = await request.json()
  const { email } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  try {
    const result = await removeFromHubSpotNewsletter(email)

    if (result.success) {
      console.log(`[Newsletter] Unsubscribed: ${email}`)
      return NextResponse.json(
        { message: "You've been unsubscribed from the newsletter." },
        { status: 200 },
      )
    } else {
      console.error(`[Newsletter] Unsubscribe failed for ${email}: ${result.error}`)
      return NextResponse.json(
        { message: result.error || 'Failed to unsubscribe.' },
        { status: 500 },
      )
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[Newsletter] Unsubscribe error for ${email}: ${errorMessage}`)
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 },
    )
  }
}
