import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";
import bcryptjs from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
// import Email from "next-auth/providers/email";
// import { env } from "@/env.mjs";

export const authConfig = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/sign-in",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
  },
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
    //       pass: env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: env.EMAIL_FROM,
    // }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password.");
        }

        const user = await db.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user?.hashedPassword) {
          throw new Error("Invalid email or password.");
        }

        const isCorrectPassword = await bcryptjs.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid email or password.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      return baseUrl;
    },
  },
  logger: {
    error(code) {
      if (code.name === "SessionTokenError") {
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig);

export async function getUser() {
  const session = await auth();
  return session?.user;
}
