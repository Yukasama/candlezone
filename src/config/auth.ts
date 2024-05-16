import 'server-only'
import Facebook from 'next-auth/providers/facebook'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { SignInSchema } from '../lib/validators/user'
// import Email from "next-auth/providers/nodemailer";
// import { env } from "@/env.mjs";
import bcrypt from 'bcryptjs'
import { logger } from '@/lib/logger'
import { getUserByEmail } from '@/utils/queries/user'

// Separate auth configuration from NextAuth configuration
// to prevent edge runtime errors
export const authConfig = {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Facebook({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    // Email({
    //   server: {
    //     host: env.EMAIL_SERVER_HOST,
    //     port: Number(env.EMAIL_SERVER_PORT),
    //     auth: {
    //       user: env.EMAIL_SERVER_USER,
    //       pass: env.RESEND_API_KEY,
    //     },
    //   },
    //   from: env.EMAIL_FROM,
    // }),
    Credentials({
      /**
       * Validate the credentials provided by the user.
       * @param credentials Credentials provided by the user
       * @returns User object or null
       */
      authorize: async (credentials) => {
        const validatedFields = SignInSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          logger.debug('authorize (attempt): email=%s', email)

          const user = await getUserByEmail({ email })
          if (!user?.hashedPassword) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.hashedPassword
          )

          if (passwordsMatch) {
            logger.debug('authorize (success): email=%s', email)
            return user
          }
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
