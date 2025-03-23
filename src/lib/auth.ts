import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';
import { authConfig } from '../config/auth';
import { logger } from './logger';

export const { auth, handlers, signIn } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token;
      }

      const existingUser = await db.user.findUnique({
        select: { email: true, name: true, role: true },
        where: { id: token.sub },
      });

      if (existingUser) {
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
      }

      logger.trace('auth_jwt (done): token=%o', token);
      return token;
    },
    session: ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      session.user.name = token.name;

      logger.trace('auth_session (done): session=%o', session);
      return session;
    },
    signIn: async ({ account, user }) => {
      const existingUser = await db.user.findFirst({
        select: { emailVerified: true, id: true, twoFactor: true },
        where: { id: user.id },
      });

      const isCredentials = account?.provider === 'credentials';

      if (isCredentials && !existingUser?.emailVerified) {
        logger.debug('auth_signIn (email_not_verified): userId=%s', user.id);
        return false;
      }

      if (isCredentials && existingUser?.twoFactor) {
        const isTwoFactorEnabled =
          await db.twoFactorTotpConfirmation.findUnique({
            where: { userId: user.id },
          });

        if (!isTwoFactorEnabled) {
          logger.debug('auth_signIn (totp_not_setup): userId=%s', user.id);
          return false;
        }
      }

      logger.debug('auth_signIn (done): userId=%s', user.id);
      return true;
    },
  },
  events: {
    linkAccount: async ({ user }) => {
      await db.user.update({
        data: { emailVerified: new Date() },
        where: { id: user.id },
      });
    },
  },
  pages: {
    error: '/error',
    signIn: '/sign-in',
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
