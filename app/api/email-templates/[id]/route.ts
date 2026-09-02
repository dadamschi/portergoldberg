import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/client'

export const dynamic = 'force-dynamic'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

// PATCH - Update an email template
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, subject, htmlContent } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    if (!title && !subject && !htmlContent) {
      return NextResponse.json(
        { error: 'At least one field (title, subject, htmlContent) is required' },
        { status: 400 }
      )
    }

    const updates: Record<string, string> = {}
    if (title) updates.title = title
    if (subject) updates.subject = subject
    if (htmlContent) updates.htmlContent = htmlContent

    const updatedTemplate = await writeClient
      .patch(id)
      .set(updates)
      .commit()

    return NextResponse.json({ template: updatedTemplate })
  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    )
  }
}
