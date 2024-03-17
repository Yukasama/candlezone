import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./src/lib/validators/user";
import { getUserByEmail } from "./src/lib/data/user";
import bcrypt from "bcryptjs";

export default {
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
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.hashedPassword) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.hashedPassword
          );

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
