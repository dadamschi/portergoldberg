import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Pass the full URL to downstream handlers (used by not-found.tsx)
  response.headers.set('x-url', request.url)
  response.headers.set('x-pathname', request.nextUrl.pathname)

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  // Run on all routes except static files and api routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
