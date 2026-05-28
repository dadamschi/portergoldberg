import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Pass the full URL to downstream handlers (used by not-found.tsx)
  response.headers.set('x-url', request.url)
  response.headers.set('x-pathname', request.nextUrl.pathname)

  return response
}

export const config = {
  // Run on all routes except static files and api routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
