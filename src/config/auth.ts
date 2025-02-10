import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import bcryptjs from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import 'server-only';
import { SignInSchema } from '../features/auth/lib/validators';

/**
 * Separate auth configuration from NextAuth configuration
 * to prevent edge runtime errors
 */
export const authConfig = {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Facebook({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      /**
       * Validate the credentials provided by the user.
       * @param credentials Credentials provided by the user
       * @returns User object or null
       */
      async authorize(credentials) {
        const { success, data } = SignInSchema.safeParse(credentials);

        if (success) {
          const { email, password } = data;
          logger.debug('authorize (attempt): email=%s', email);

          const user = await db.user.findUnique({ where: { email } });
          if (!user?.hashedPassword) {
            // eslint-disable-next-line unicorn/no-null
            return null;
          }

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.hashedPassword,
          );

          if (passwordsMatch) {
            logger.debug('authorize: email=%s', email);
            return user;
          }
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
