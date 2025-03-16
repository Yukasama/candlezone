import { authConfig } from '@/config/auth';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { generateCspHeader } from './config/csp-header';
import {
  adminRoutePrefix,
  apiAuthPrefix,
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

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isUserRoute = userRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(adminRoutePrefix);

  const needsTwoFactor = auth?.requiresTwoFactor === true;

  const withCSP = (response: NextResponse) => {
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  };

  if (isApiAuthRoute) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Security-Policy', cspHeader);
    return response;
  }

  if (needsTwoFactor) {
    // Don't redirect if already on 2FA page
    if (pathname === '/two-factor') {
      return withCSP(
        NextResponse.next({
          request: { headers: requestHeaders },
        }),
      );
    }

    // Redirect auth routes to 2FA
    if (isAuthRoute) {
      return withCSP(NextResponse.redirect(new URL('/two-factor', req.url)));
    }

    // Redirect all other protected routes to 2FA
    if (isUserRoute || isAdminRoute || pathname === DEFAULT_LOGIN_REDIRECT) {
      return withCSP(NextResponse.redirect(new URL('/two-factor', req.url)));
    }

    // Allow access to public routes
    return withCSP(
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
    );
  }

  if (isAuthRoute) {
    const response = isLoggedIn
      ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      : NextResponse.next({
          request: { headers: requestHeaders },
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
    request: { headers: requestHeaders },
  });
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
