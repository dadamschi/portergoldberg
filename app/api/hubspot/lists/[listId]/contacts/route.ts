import { NextRequest, NextResponse } from 'next/server'
import { getContactsFromList } from '@/lib/hubspot'

export const dynamic = 'force-dynamic'

type RouteParams = {
  params: Promise<{
    listId: string
  }>
}

// GET - Fetch contacts from a specific HubSpot list
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { listId } = await params

    if (!listId) {
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      )
    }

    const contacts = await getContactsFromList(listId)

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts from list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
