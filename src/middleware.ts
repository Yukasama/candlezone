import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  authRoutes,
  userRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_AUTH_REDIRECT,
  adminRoutePrefix,
} from './config/routes'
import { authConfig } from '@/config/auth'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  const { nextUrl } = req
  const user = req.auth?.user

  let response
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isUserRoute = userRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutePrefix)

  if (isAuthRoute) {
    if (user) {
      response = NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    } else {
      response = NextResponse.next()
    }
  } else if (isUserRoute && !user) {
    response = NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, nextUrl))
  } else if (isAdminRoute && !user) {
    response = NextResponse.rewrite(new URL('/404', req.url))
  } else {
    response = NextResponse.next()
  }

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('x-nonce', nonce)
  return response
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
