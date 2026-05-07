import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL, CONTACT_EMAIL } from '@/lib/resend'

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

  // Send email via Resend
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><strong>Newsletter signup:</strong> ${subscribeNewsletter ? 'Yes' : 'No'}</p>
      <p><strong>Vendor list signup:</strong> ${addToVendorList ? 'Yes' : 'No'}</p>
    `,
  })

  if (error) {
    console.error('[Connect] Failed to send email:', error)
    return NextResponse.json({ message: 'Failed to send message. Please try again.' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Subscribe to newsletter if checkbox was checked
  if (subscribeNewsletter) {
    console.log('[Connect] Subscribing', email);
    try {
      await fetch(`${baseUrl}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch (err) {
      console.error(`[Connect] Failed to subscribe ${email} to newsletter:`, err)
    }
  }

  // Add to vendor list if checkbox was checked
  if (addToVendorList) {
    console.log('[Connect] Adding', email, 'to vendor list');
    try {
      await fetch(`${baseUrl}/api/vendor-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
    } catch (err) {
      console.error(`[Connect] Failed to add ${email} to vendor list:`, err)
    }
  }

  return NextResponse.json(
    { message: "Thanks for reaching out! We'll be in touch soon." },
    { status: 200 },
  )
}
