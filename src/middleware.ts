import NextAuth from 'next-auth'
import {
  authRoutes,
  userRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_AUTH_REDIRECT,
  adminRoutePrefix,
} from './config/routes'
import { authConfig } from '@/config/auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const user = req.auth?.user

  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isUserRoute = userRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutePrefix)

  if (isAuthRoute) {
    if (user) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  if (isUserRoute && !user) {
    return Response.redirect(new URL(DEFAULT_AUTH_REDIRECT, nextUrl))
  }

  if (isAdminRoute && !user) {
    return NextResponse.rewrite(new URL('/404', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
