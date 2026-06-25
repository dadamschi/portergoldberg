'use server'

import {
  addContact, updateContactProperties, buildHubspotContactLink
} from '@/lib/hubspot'
import { EMAIL_NOTIFICATION_RECIPIENTS } from '@/lib/constants'

type ConnectFormData = {
  name: string
  email: string
  message: string
  subscribeNewsletter?: boolean
  addToVendorList?: boolean
  pageUrl?: string
  propertyAddress?: string
}

type ConnectResult = {
  success: boolean
  message: string
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim()
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }
  const firstName = parts[0]
  const lastName = parts.slice(1).join(' ')
  return { firstName, lastName }
}

export async function submitConnectForm(data: ConnectFormData): Promise<ConnectResult> {
  const { name, email, message, addToVendorList, pageUrl, subscribeNewsletter, propertyAddress } = data

  if (!name || !name.trim()) {
    return { success: false, message: 'Please enter your name.' }
  }
  const { firstName, lastName } = splitName(name)
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  if (!message || !message.trim()) {
    return { success: false, message: 'Please enter a message.' }
  }

  const { contact } = await addContact({
          email,
          firstName,
          lastName
        })
  
  let tiers = 'Warm'
  if(subscribeNewsletter) {
    tiers = await addPropertyValue(tiers, 'Newsletter')  
  }

  const propertiesArray = [
    { "property": "tier", "value": tiers },
  ]
  
  if(propertyAddress) {
    let propertyAddresses = propertyAddress
    if(contact.interested_property) {
      propertyAddresses = await addPropertyValue(contact.interested_property, propertyAddress)
    }
    propertiesArray.push({ "property": "interested_property", "value": propertyAddresses })
  }

  await updateContactProperties(contact.id, propertiesArray)

  const { sendEmail } = await import('@/lib/email')
  const hubspotContactLink = contact.id ? (await buildHubspotContactLink(contact.id)) : ''

  const { error } = await sendEmail({
    to: EMAIL_NOTIFICATION_RECIPIENTS,
    replyTo: email,
    subject: `New inquiry from ${name}${propertyAddress ? ` - ${propertyAddress}` : ''}`,
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
      ${contact.id ? `<p><strong>HubSpot contact:</strong> ${hubspotContactLink}</p>` : ''}
    `,
  })

  if (error) {
    console.error('[Connect] Failed to send email:', error)
    return { success: false, message: 'Failed to send message. Please try again.' }
  }
  
  return { success: true, message: "Thanks for reaching out! We'll be in touch soon." }
}

export async function addPropertyValue(currentTier: string, valueToAdd: string): Promise<string> {
  const values = currentTier ? currentTier.split(';').map(v => v.trim()).filter(Boolean) : []
  if (!values.includes(valueToAdd)) {
    values.push(valueToAdd)
  }
  return values.join(';')
}
