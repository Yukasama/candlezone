import { appConfig } from '@/config/app';
import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';
import { authConfig } from '../config/auth';
import { logger } from './logger';

const { twoFactorExpiry, twoFactorUseWindow } = appConfig.token;

export const { auth, handlers, signIn } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (token.twoFactorAuthenticated === true) {
        token.requiresTwoFactor = false;

        if (!token.name || !token.email || !token.role) {
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

        logger.debug('auth_jwt (2fa_already_complete): userId=%s', token.sub);
        return token;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user && 'requiresTwoFactor' in user) {
        token.requiresTwoFactor = user.requiresTwoFactor;
      }

      if (!token.sub) {
        return token;
      }

      if (token.requiresTwoFactor && !token.twoFactorAuthenticated) {
        const recentlyConfirmedFlow = await db.twoFactorFlow.findFirst({
          orderBy: { confirmed: 'desc' },
          where: {
            confirmed: {
              gt: new Date(Date.now() - twoFactorExpiry),
            },
            OR: [
              { used: null },
              { used: { gt: new Date(Date.now() - twoFactorUseWindow) } },
            ],
            userId: token.sub,
          },
        });

        if (recentlyConfirmedFlow) {
          token.requiresTwoFactor = false;
          token.twoFactorAuthenticated = true;

          const existingUser = await db.user.findUnique({
            select: { email: true, name: true, role: true },
            where: { id: token.sub },
          });

          if (existingUser) {
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
          }

          if (recentlyConfirmedFlow.used === null) {
            await db.twoFactorFlow.update({
              data: { used: new Date() },
              where: { id: recentlyConfirmedFlow.id },
            });
          }

          logger.debug('auth_jwt (2fa_completed): userId=%s', token.sub);
        } else {
          const partialToken = { requiresTwoFactor: true, sub: token.sub };
          logger.debug(
            'auth_jwt (requires_2fa): partialToken=%o',
            partialToken,
          );
          return partialToken;
        }
      } else {
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

      if (token.requiresTwoFactor) {
        const partialSession = {
          expires: session.expires,
          user: { id: session.user.id, requiresTwoFactor: true },
        };
        logger.debug(
          'auth_session (requires_2fa): partialSession=%o',
          partialSession,
        );
        return partialSession;
      }

      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      session.user.name = token.name;

      if (token.twoFactorAuthenticated) {
        session.user.twoFactorAuthenticated =
          token.twoFactorAuthenticated as boolean;
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
      }

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
