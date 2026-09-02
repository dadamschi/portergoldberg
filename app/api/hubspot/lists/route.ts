import { NextResponse } from 'next/server'
import { getHubSpotLists } from '@/lib/hubspot'

export const dynamic = 'force-dynamic'

// GET - Fetch all lists/segments from HubSpot
export async function GET() {
  try {
    const lists = await getHubSpotLists()
    return NextResponse.json({ lists })
  } catch (error) {
    console.error('Error fetching HubSpot lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    )
  }
}
