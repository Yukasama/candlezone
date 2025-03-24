import { authConfig } from '@/config/auth';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { generateCspHeader } from './config/csp-header';
import {
  ADMIN_ROUTE_PREFIX,
  authRoutes,
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  userRoutes,
} from './config/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { auth, nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!auth;

  const isUserRoute = userRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = generateCspHeader({ nonce });

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-nonce', nonce);
  reqHeaders.set('Content-Security-Policy', cspHeader);

  let response = NextResponse.next({ request: { headers: reqHeaders } });

  if (isAuthRoute && isLoggedIn) {
    response = NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  } else if (isUserRoute && !isLoggedIn) {
    response = NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, nextUrl));
  } else if (isAdminRoute && !isLoggedIn) {
    response = NextResponse.rewrite(new URL('/404', req.url), {
      request: { headers: reqHeaders },
    });
  }

  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
});

export const config = {
  matcher: [
    {
      missing: [
        { key: 'next-router-prefetch', type: 'header' },
        { key: 'purpose', type: 'header', value: 'prefetch' },
      ],
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    },
  ],
};
