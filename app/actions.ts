'use server'

type ConnectFormData = {
  name: string
  email: string
  message: string
  subscribeNewsletter?: boolean
  addToVendorList?: boolean
  pageUrl?: string
}

type ConnectResult = {
  success: boolean
  message: string
}

export async function submitConnectForm(data: ConnectFormData): Promise<ConnectResult> {
  const { name, email, message, subscribeNewsletter, addToVendorList, pageUrl } = data

  if (!name || !name.trim()) {
    return { success: false, message: 'Please enter your name.' }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  if (!message || !message.trim()) {
    return { success: false, message: 'Please enter a message.' }
  }

  const { sendEmail } = await import('@/lib/email')

  // Send to info@ and artplexity
  const recipients = ['info@portergoldberg.com', 'contact@artplexity.com']
  const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''
  const fromEmail = `"Porter Goldberg Website" <${fromAddress}>`

  const { error } = await sendEmail({
    from: fromEmail,
    to: recipients,
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      ${pageUrl ? `<p><em>Submitted from: <a href="${pageUrl}">${pageUrl}</a></em></p>` : ''}
      <hr>
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
        body: JSON.stringify({ email, name }),
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

type TestFormData = {
  name: string
  email: string
  message: string
  pageUrl?: string
  subscribeNewsletter?: boolean
  addToVendorList?: boolean
}

type TestResult = {
  success: boolean
  message: string
  sentTo?: string
}

export async function submitTestForm(data: TestFormData): Promise<TestResult> {
  const { sendEmail } = await import('@/lib/email')
  const { name, email, message, pageUrl, subscribeNewsletter, addToVendorList } = data

  if (!name || !name.trim()) {
    return { success: false, message: 'Please enter your name.' }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  if (!message || !message.trim()) {
    return { success: false, message: 'Please enter a message.' }
  }

  const testRecipient = process.env.TEST_EMAIL_RECIPIENT
  if (!testRecipient) {
    throw new Error('Missing TEST_EMAIL_RECIPIENT environment variable')
  }

  const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''
  const fromEmail = `"Porter Goldberg" <${fromAddress}>`

  // Send email via SMTP to TEST recipient only (no portergoldberg addresses)
  const { error } = await sendEmail({
    from: fromEmail,
    to: testRecipient,
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      ${pageUrl ? `<p><em>Submitted from: <a href="${pageUrl}">${pageUrl}</a></em></p>` : ''}
      <hr>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><strong>Subscribe to newsletter:</strong> ${subscribeNewsletter ? 'Yes' : 'No'}</p>
      <p><strong>Add to vendor list:</strong> ${addToVendorList ? 'Yes' : 'No'}</p>
    `,
  })

  if (error) {
    console.error('[TestForm] Failed to send email:', error)
    return { success: false, message: `Failed to send message: ${error.message}` }
  }

  return { success: true, message: 'Test email sent!', sentTo: testRecipient }
}
