import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = ['/quizsets', '/quiz/create']

export async function middleware(req) {
  const token = await getToken({ req })

  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}
