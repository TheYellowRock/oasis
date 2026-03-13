import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const typeRedirectMap: Record<string, string> = {
  office: 'office',
  warehouse: 'warehouse',
  retail: 'retail',
  'self-storage': 'self-storage',
  storage: 'self-storage',
  restaurant: 'restaurant',
  coworking: 'coworking',
  residential: 'residential',
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/leasing') {
    return NextResponse.next()
  }

  const type = request.nextUrl.searchParams.get('type')?.toLowerCase()
  if (!type) {
    return NextResponse.next()
  }

  const targetType = typeRedirectMap[type]
  if (!targetType) {
    return NextResponse.next()
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/spaces/${targetType}`
  redirectUrl.searchParams.delete('type')

  return NextResponse.redirect(redirectUrl, 308)
}

export const config = {
  matcher: ['/leasing'],
}
