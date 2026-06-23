import { NextResponse } from 'next/server'
import { unsubscribeFromNewsletter } from '@/lib/hubspot'

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
    const result = await unsubscribeFromNewsletter(email)

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
