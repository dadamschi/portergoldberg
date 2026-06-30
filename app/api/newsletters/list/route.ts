import { client } from '@/lib/client'
import { ALL_NEWSLETTERS_ADMIN_QUERY } from '@/lib/queries'

export async function GET() {
  const newsletters = await client.fetch(ALL_NEWSLETTERS_ADMIN_QUERY)
  return Response.json(newsletters)
}
