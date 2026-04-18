import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body: { name?: string; email?: string; message?: string } = await request.json()
  const { name, email, message } = body

  if (!name || !name.trim()) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!message || !message.trim()) {
    return NextResponse.json({ message: 'Please enter a message.' }, { status: 400 })
  }

  // TODO: Connect to email service, CRM, or notification system
  // Examples:
  // - Send email via Resend/SendGrid
  // - Create lead in CRM
  // - Post to Slack channel
  console.log(`[Connect] New inquiry from ${name} (${email}): ${message.slice(0, 100)}`)

  return NextResponse.json(
    { message: "Thanks for reaching out! We'll be in touch soon." },
    { status: 200 },
  )
}
