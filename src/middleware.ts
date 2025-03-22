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

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = generateCspHeader({ nonce });

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-nonce', nonce);
  reqHeaders.set('Content-Security-Policy', cspHeader);

  const isUserRoute = userRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);

  let response = NextResponse.next({ request: { headers: reqHeaders } });

  if (isAuthRoute && isLoggedIn) {
    response = NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  } else if (pathname === '/sign-in' && !nextUrl.search && !isLoggedIn) {
    const referer = req.headers.get('referer');

    if (referer) {
      const refUrl = new URL(referer);
      const refPathname = refUrl.pathname;

      const isSameOrigin = refUrl.origin === nextUrl.origin;
      const isProtectedReferer =
        authRoutes.includes(refPathname) ||
        userRoutes.includes(refPathname) ||
        refPathname.startsWith(ADMIN_ROUTE_PREFIX);

      if (isSameOrigin && !isProtectedReferer && refPathname !== '/sign-in') {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('callbackUrl', refPathname);
        response = NextResponse.redirect(signInUrl);
      }
    }
  } else if (isUserRoute && !isLoggedIn) {
    const signInUrl = new URL(DEFAULT_AUTH_REDIRECT, req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    response = NextResponse.redirect(signInUrl);
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
