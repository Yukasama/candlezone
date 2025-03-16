import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';
import { authConfig } from '../config/auth';
import { logger } from './logger';

export const { auth, handlers, signIn } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: async ({ token, user }) => {
      // If we have a user object from sign-in with a requiresTwoFactor flag, add it to token
      if (user && 'requiresTwoFactor' in user) {
        token.requiresTwoFactor = user.requiresTwoFactor;
      }

      if (!token.sub) {
        return token;
      }

      // If token requires 2FA but hasn't completed it yet, check for confirmation
      if (token.requiresTwoFactor === true) {
        const recentlyConfirmedFlow = await db.twoFactorFlow.findFirst({
          orderBy: { confirmed: 'desc' },
          where: {
            confirmed: { gt: new Date(Date.now() - 10 * 1000) },
            userId: token.sub,
          },
        });

        if (recentlyConfirmedFlow) {
          logger.debug('auth_jwt (2fa_completed): userId=%s', token.sub);

          // Remove requiresTwoFactor flag and add twoFactorAuthenticated
          token.requiresTwoFactor = undefined;
          token.twoFactorAuthenticated = true;

          // Now we can load the user data since 2FA is completed
          const existingUser = await db.user.findUnique({
            select: { email: true, name: true, role: true },
            where: { id: token.sub },
          });

          if (existingUser) {
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
          }
        }

        // If not confirmed, just keep the partial token with requiresTwoFactor flag
        // Don't load additional user data
      } else {
        // 2FA not required, load full user data
        const existingUser = await db.user.findUnique({
          select: { email: true, name: true, role: true },
          where: { id: token.sub },
        });

        if (existingUser) {
          token.name = existingUser.name;
          token.email = existingUser.email;
          token.role = existingUser.role;
        }
      }

      logger.debug('auth_jwt (done): token=%o', token);

      return token;
    },

    session: ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.requiresTwoFactor === true) {
        session.requiresTwoFactor = true;
        return session;
      }

      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      session.user.name = token.name;

      if (token.twoFactorAuthenticated) {
        session.twoFactorAuthenticated = token.twoFactorAuthenticated;
      }

      logger.debug('auth_session (done): session=%o', session);

      return session;
    },

    signIn: async ({ account, user }) => {
      const existingUser = await db.user.findFirst({
        select: { emailVerified: true, id: true, twoFactor: true },
        where: { id: user.id },
      });

      if (account?.provider === 'credentials' && !existingUser?.emailVerified) {
        logger.debug('auth_signIn (email_not_verified): userId=%s', user.id);
        return false;
      }

      if (existingUser?.twoFactor === 'EMAIL') {
        const twoFactorConf = await db.twoFactorEmailConfirmation.findUnique({
          where: { userId: user.id },
        });

        if (!twoFactorConf) {
          logger.debug(
            'auth_signIn (email_2fa_not_confirmed): userId=%s',
            user.id,
          );
          return false;
        }

        await db.twoFactorEmailConfirmation.delete({
          where: { id: twoFactorConf.id },
        });
      }

      if (existingUser?.twoFactor === 'TOTP') {
        const isTwoFactorEnabled =
          await db.twoFactorTotpConfirmation.findUnique({
            where: { userId: user.id },
          });

        if (!isTwoFactorEnabled) {
          logger.debug('auth_signIn (totp_not_setup): userId=%s', user.id);
          return false;
        }

        // Mark user as requiring 2FA
        // This will be picked up by JWT callback
        user.requiresTwoFactor = true;
      }

      // Allow sign-in to continue (with potentially limited session)
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
