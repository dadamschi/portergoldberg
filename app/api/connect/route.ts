import { NextResponse } from 'next/server'

type ContactBody = {
  name?: string
  email?: string
  message?: string
  subscribeNewsletter?: boolean
  addToVendorList?: boolean
}

export async function POST(request: Request) {
  const body: ContactBody = await request.json()
  const { name, email, message, subscribeNewsletter, addToVendorList } = body

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
  console.log(`[Connect] Newsletter: ${subscribeNewsletter}, Vendor List: ${addToVendorList}`)

  return NextResponse.json(
    { message: "Thanks for reaching out! We'll be in touch soon." },
    { status: 200 },
  )
}
