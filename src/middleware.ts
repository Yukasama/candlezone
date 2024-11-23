import { authConfig } from '@/config/auth';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import {
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  adminRoutePrefix,
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
  const user = auth?.user;
  const { pathname } = nextUrl;

  if (authRoutes.includes(pathname)) {
    return user
      ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      : NextResponse.next();
  }

  if (userRoutes.some((route) => pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, nextUrl));
  }

  if (pathname.startsWith(adminRoutePrefix) && !user) {
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
