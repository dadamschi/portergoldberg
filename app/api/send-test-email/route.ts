import { NextResponse } from 'next/server'
import { client } from '@/lib/client'
import { EMAIL_TEMPLATE_BY_ID_QUERY } from '@/lib/queries'
import { sendEmail, FROM_EMAIL } from '@/lib/email'
import { EMAIL_SIGNATURE_HTML } from '@/lib/utils/newsletter'
import type { EmailTemplate } from '@/types'

export const dynamic = 'force-dynamic'

// Allowed test email recipients
const ALLOWED_TEST_EMAILS = [
  // 'info@portergoldberg.com',
  'dadams.chi@gmail.com',
]

// Test data for mustache variable replacement
const TEST_DATA = {
  lastname: 'Doe',
  email: 'test@example.com',
  tier: 'Gold',
  interested_property: '123 Main St, Chicago, IL',
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
  // Check if content already has HTML structure (has opening tags like <html>, <body>, <div>, <p>, etc.)
  const hasHtmlStructure = /<(html|body|div|p|table|h[1-6])/i.test(content)

  if (hasHtmlStructure) {
    // Content already has HTML, return as-is
    return content
  }

  // Convert plain text newlines to <br> tags (preserving empty lines)
  // Replace \r\n first (Windows), then \n (Unix/Mac)
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
    const { templateId, recipientEmail } = body

    // Validate inputs
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      )
    }

    // Validate recipient email is in allowed list
    if (!ALLOWED_TEST_EMAILS.includes(recipientEmail)) {
      return NextResponse.json(
        { error: `Test emails can only be sent to: ${ALLOWED_TEST_EMAILS.join(', ')}` },
        { status: 403 }
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

    // Replace mustache variables in subject and content
    const subject = replaceMustacheVariables(template.subject, TEST_DATA)
    let htmlContent = replaceMustacheVariables(template.htmlContent, TEST_DATA)

    // Format HTML content (convert newlines to <br> if needed, wrap in HTML structure)
    htmlContent = formatHtmlContent(htmlContent)

    // Send email
    const { error } = await sendEmail({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `[TEST] ${subject}`,
      html: htmlContent,
    })

    if (error) {
      console.error('Error sending test email:', error)
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${recipientEmail}`,
    })
  } catch (error) {
    console.error('Error in send-test-email:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
