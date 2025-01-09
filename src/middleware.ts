import { authConfig } from '@/config/auth';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import {
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  adminRoutePrefix,
  apiAuthPrefix,
  authRoutes,
  userRoutes,
} from './config/routes';
// import { aj } from './lib/arcjet';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // const decision = await aj.protect(req);

  // if (decision.isDenied() && decision.reason.isBot()) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }

  const { nextUrl, auth } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!auth;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isUserRoute = userRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(adminRoutePrefix);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    return isLoggedIn
      ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      : NextResponse.next();
  }

  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, nextUrl));
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
