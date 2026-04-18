import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    // Revalidate the entire site
    revalidatePath('/', 'layout')

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Revalidation failed:', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
