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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Subscribe to newsletter if checkbox was checked
  if (subscribeNewsletter) {
    try {
      await fetch(`${baseUrl}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      console.log(`[Connect] Subscribed ${email} to newsletter`)
    } catch (error) {
      console.error(`[Connect] Failed to subscribe ${email} to newsletter:`, error)
    }
  }

  // Add to vendor list if checkbox was checked
  if (addToVendorList) {
    try {
      await fetch(`${baseUrl}/api/vendor-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      console.log(`[Connect] Added ${email} to vendor list`)
    } catch (error) {
      console.error(`[Connect] Failed to add ${email} to vendor list:`, error)
    }
  }

  return NextResponse.json(
    { message: "Thanks for reaching out! We'll be in touch soon." },
    { status: 200 },
  )
}
