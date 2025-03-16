import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Mastodon from 'next-auth/providers/mastodon';
import 'server-only';
import { SignInSchema } from '../features/auth/lib/validators';

/**
 * Separate auth configuration from NextAuth configuration
 * to prevent edge runtime errors
 */
export const authConfig = {
  providers: [
    Mastodon,
    Google({
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login',
      },
    }),
    GitHub({
      authorization: {
        url: 'https://github.com/login/oauth/authorize?response_type=code&prompt=login',
      },
    }),
    Credentials({
      /**
       * Validate the credentials provided by the user.
       * @param credentials Credentials provided by the user
       * @returns User object or null
       */
      authorize: async (credentials) => {
        const { data, success } = SignInSchema.safeParse(credentials);

        if (success) {
          const { email, password } = data;

          const user = await db.user.findUnique({ where: { email } });
          if (!user?.hashedPassword) {
            logger.debug('authorize (not_found): email=%s', email);
            // eslint-disable-next-line unicorn/no-null
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
          );

          if (passwordsMatch) {
            logger.debug('authorize (done): email=%s', email);
            return { ...user, hashedPassword: undefined };
          }
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
      },
      id: 'credentials',
      name: 'Credentials',
    }),
  ],
} satisfies NextAuthConfig;
