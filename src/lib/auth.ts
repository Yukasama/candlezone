import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { authConfig } from '../config/auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  callbacks: {
    session({ token, session }) {
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

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await db.user.findUnique({
        select: {
          name: true,
          email: true,
          role: true,
        },
        where: { id: token.sub },
      });

      if (!existingUser) {
        return token;
      }

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
  },
  // events: {
  //   async linkAccount({ user }) {
  //     await db.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() },
  //     });
  //   },
  // },
  ...authConfig,
});
