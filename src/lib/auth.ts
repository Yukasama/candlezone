import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { authConfig } from '../config/auth';
import { logger } from './logger';

export const { auth, handlers, signIn, signOut } = NextAuth({
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

      if (!existingUser) {
        return token;
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      logger.debug('auth_jwt (done): token=%o', token);

      return token;
    },
    session: ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      session.user.name = token.name;

      logger.debug('auth_session (done): session=%o', session);

      return session;
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
