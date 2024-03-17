"use server";

import { getUserByEmail } from "@/lib/data/user";
import { db } from "@/lib/db";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { SignInSchema } from "@/lib/validators/user";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function login(
  values: z.infer<typeof SignInSchema>,
  callbackUrl?: string | null
) {
  const validatedFields = SignInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await db.verificationToken.findFirst({
        where: { identifier: existingUser.email },
      });

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.verificationToken.delete({
        where: { token: twoFactorToken.token },
      });

      const existingConfirmation = await db.twoFactorConfirmation.findUnique({
        where: { userId: existingUser.id },
      });

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        twoFactorToken.identifier,
        twoFactorToken.token
      );

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "We have trouble signing you in." };
      }
    }

    throw error;
  }
}
