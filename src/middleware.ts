import { authConfig } from '@/config/auth';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { generateCspHeader } from './config/csp-header';
import {
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  adminRoutePrefix,
  apiAuthPrefix,
  authRoutes,
  userRoutes,
} from './config/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!auth;

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = generateCspHeader({ nonce });

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isUserRoute = userRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(adminRoutePrefix);

  if (isApiAuthRoute) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  if (isAuthRoute) {
    const response = isLoggedIn
      ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      : NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  if (isUserRoute && !isLoggedIn) {
    const response = NextResponse.redirect(
      new URL(DEFAULT_AUTH_REDIRECT, nextUrl),
    );
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  if (isAdminRoute && !isLoggedIn) {
    const response = NextResponse.rewrite(new URL('/404', req.url), {
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
});

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
