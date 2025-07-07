import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  const isAuthPage =
    pathname.startsWith('/register') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/_next')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/register', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|login|register).*)',
  ],
}