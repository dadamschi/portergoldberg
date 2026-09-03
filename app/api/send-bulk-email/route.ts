import { NextResponse } from 'next/server'
import { client } from '@/lib/client'
import { EMAIL_TEMPLATE_BY_ID_QUERY } from '@/lib/queries'
import { FROM_EMAIL } from '@/lib/email'
import { EMAIL_SIGNATURE_HTML } from '@/lib/utils/newsletter'
import { createEmailEngagement } from '@/lib/hubspot'
import type { EmailTemplate } from '@/types'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for large sends

type Contact = {
  id: string
  email: string
  firstname: string
  lastname: string
  tier: string
  interested_property: string
}

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY environment variable')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function replaceMustacheVariables(content: string, data: Record<string, string>): string {
  let result = content

  // First, handle variables with defaults: {{field|default}}
  result = result.replace(/\{\{(\w+)\|([^}]+)\}\}/g, (match, field, defaultValue) => {
    const value = data[field]
    // Use default if value is null, undefined, or empty string
    return value && value.trim() !== '' ? value : defaultValue
  })

  // Then, handle regular variables: {{field}}
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(regex, value || '')
  }

  return result
}

function formatHtmlContent(content: string): string {
  // Check if content already has HTML structure
  const hasHtmlStructure = /<(html|body|div|p|table|h[1-6])/i.test(content)

  if (hasHtmlStructure) {
    // Content already has HTML, just add signature
    return `${content}${EMAIL_SIGNATURE_HTML}`
  }

  // Convert plain text newlines to <br> tags
  const contentWithBreaks = content
    .replace(/\r\n/g, '<br />')
    .replace(/\n/g, '<br />')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
  <div style="padding: 20px;">
    ${contentWithBreaks}
    ${EMAIL_SIGNATURE_HTML}
  </div>
</body>
</html>
  `.trim()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { templateId, contacts } = body as {
      templateId: string
      contacts: Contact[]
    }

    // Validate inputs
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'Contacts array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Fetch template
    const template = await client.fetch<EmailTemplate>(EMAIL_TEMPLATE_BY_ID_QUERY, {
      id: templateId,
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const resend = getResend()
    const results: Array<{ success: boolean; email: string; error?: string }> = []

    // Process in batches of 100 (Resend batch API limit)
    const BATCH_SIZE = 100

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE)

      // Prepare emails for this batch with contact metadata
      const emailsWithMetadata = batch.map(contact => {
        const contactData = {
          firstname: contact.firstname || '',
          lastname: contact.lastname || '',
          email: contact.email || '',
          tier: contact.tier || '',
          interested_property: contact.interested_property || '',
        }

        const subject = replaceMustacheVariables(template.subject, contactData)
        let htmlContent = replaceMustacheVariables(template.htmlContent, contactData)
        htmlContent = formatHtmlContent(htmlContent)

        return {
          contact,
          email: {
            from: 'PorterGoldberg <info@portergoldberg.com>',
            to: contact.email,
            subject,
            html: htmlContent,
          },
        }
      })

      const emails = emailsWithMetadata.map(item => item.email)

      try {
        // Send batch
        const { data, error } = await resend.batch.send(emails)

        if (error) {
          // If batch fails, mark all emails in batch as failed
          batch.forEach(contact => {
            results.push({
              success: false,
              email: contact.email,
              error: error.message || 'Batch send failed',
            })
          })
        } else {
          // Mark all emails in batch as successful and log to HubSpot
          for (const item of emailsWithMetadata) {
            results.push({
              success: true,
              email: item.contact.email,
            })

            // Create HubSpot engagement asynchronously (don't await, fire and forget)
            createEmailEngagement(
              item.contact.id,
              item.email.subject,
              item.email.html
            ).catch(err => {
              console.error(`Failed to create HubSpot engagement for ${item.contact.email}:`, err)
            })
          }
        }
      } catch (err) {
        // If exception, mark batch as failed
        batch.forEach(contact => {
          results.push({
            success: false,
            email: contact.email,
            error: err instanceof Error ? err.message : 'Unknown error',
          })
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      totalContacts: contacts.length,
      successCount,
      failureCount,
      results,
    })
  } catch (error) {
    console.error('Error in send-bulk-email:', error)
    return NextResponse.json(
      { error: 'Failed to send bulk email' },
      { status: 500 }
    )
  }
}
