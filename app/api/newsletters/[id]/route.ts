import { client } from '@/lib/client'
import { NEWSLETTER_BY_ID_QUERY } from '@/lib/queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const newsletter = await client.fetch(NEWSLETTER_BY_ID_QUERY, { id })

  if (!newsletter) {
    return Response.json({ error: 'Newsletter not found' }, { status: 404 })
  }

  return Response.json(newsletter)
}
