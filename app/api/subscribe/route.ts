import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body: { email?: string } = await request.json()
  const { email } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  // TODO: Connect to your email service (Mailchimp, ConvertKit, Resend, etc.)
  // Example:
  // await mailchimp.lists.addListMember(LIST_ID, {
  //   email_address: email,
  //   status: 'subscribed',
  // })

  console.log(`[Newsletter] New subscriber: ${email}`)

  return NextResponse.json(
    { message: "You're in! Thanks for subscribing." },
    { status: 200 },
  )
}
