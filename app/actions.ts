'use server'

import { resend, FROM_EMAIL } from '@/lib/resend'
import { client } from '@/lib/client'

type ConnectFormData = {
  name: string
  email: string
  message: string
  subscribeNewsletter?: boolean
  addToVendorList?: boolean
}

type ConnectResult = {
  success: boolean
  message: string
}

export async function submitConnectForm(data: ConnectFormData): Promise<ConnectResult> {
  const { name, email, message, subscribeNewsletter, addToVendorList } = data

  if (!name || !name.trim()) {
    return { success: false, message: 'Please enter your name.' }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  if (!message || !message.trim()) {
    return { success: false, message: 'Please enter a message.' }
  }

  // Fetch agent emails from Sanity
  const agents = await client.fetch<{ email: string }[]>(
    `*[_type == "agent"]{ email }`
  )
  const agentEmails = agents.map(a => a.email).filter(Boolean)

  if (agentEmails.length === 0) {
    throw new Error('No agent emails found in Sanity')
  }

  // Send email via Resend
  const ccEmail = process.env.CONTACT_CC_EMAIL || 'dadams.chi+portergoldbergcc@gmail.com'
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: agentEmails,
    cc: ccEmail,
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
    return { success: false, message: 'Failed to send message. Please try again.' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Subscribe to newsletter if checkbox was checked
  if (subscribeNewsletter) {
    console.log('[Connect] Subscribing', email)
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
    console.log('[Connect] Adding', email, 'to vendor list')
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

  return { success: true, message: "Thanks for reaching out! We'll be in touch soon." }
}
