import { NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/client'
import { EMAIL_TEMPLATES_QUERY } from '@/lib/queries'
import type { EmailTemplate } from '@/types'

export const dynamic = 'force-dynamic'

// GET - Fetch all email templates
export async function GET() {
  try {
    const templates = await client.fetch<EmailTemplate[]>(EMAIL_TEMPLATES_QUERY)
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}

// POST - Create a new email template
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, subject, htmlContent } = body

    if (!title || !subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subject, htmlContent' },
        { status: 400 }
      )
    }

    const newTemplate = await writeClient.create({
      _type: 'emailTemplate',
      title,
      subject,
      htmlContent,
    })

    return NextResponse.json({ template: newTemplate }, { status: 201 })
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    )
  }
}
