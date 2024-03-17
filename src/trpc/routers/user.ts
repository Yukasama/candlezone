import { privateProcedure, publicProcedure, router } from "../trpc";
import { absoluteUrl, generateName } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import {
  CreateUserSchema,
  ResetPasswordSchema,
  SignInSchema,
  UserUpdateSchema,
} from "@/lib/validators/user";
import { z } from "zod";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/token";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/data/user";
import { signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const userRouter = router({
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    const dbUser = await db.user.findFirst({
      select: {
        id: true,
        stripeCustomerId: true,
      },
      where: { id: user.id },
    });

    if (!dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const billingUrl = absoluteUrl("/billing");
    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    // const stripeSession = await stripe.checkout.sessions.create({
    //   success_url: billingUrl,
    //   cancel_url: billingUrl,
    //   payment_method_types: ["card", "paypal"],
    //   mode: "subscription",
    //   billing_address_collection: "auto",
    //   line_items: [
    //     {
    //       price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
    //       quantity: 1,
    //     },
    //   ],
    //   metadata: { userId: ctx.user.id },
    // });

    // return { url: stripeSession.url };
  }),
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const existingUser = await db.user.count({
        where: { email },
      });

      if (existingUser) {
        return { error: "Email is already registered." };
      }

      const [hashedPassword, verificationToken] = await Promise.all([
        bcrypt.hash(password, 10),
        generateVerificationToken(email),
      ]);

      const name = generateName();

      await Promise.all([
        db.user.create({
          data: { name, email, hashedPassword },
        }),
        sendVerificationEmail(input.email, verificationToken.token),
      ]);

      return { success: "Confirmation email sent!" };
    }),
  update: privateProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name, biography } = input;

      await db.user.update({
        where: { id: user.id },
        data: {
          ...(name && { name }),
          ...(biography && { biography }),
        },
      });
    }),
  delete: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    await db.user.delete({
      where: { id: user.id },
    });
  }),
  newPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ input }) => {
      const { password, token } = input;

      const existingToken = await db.verificationToken.findUnique({
        where: { token },
      });

      if (!existingToken) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const existingUser = await db.user.findFirst({
        where: { email: existingToken.identifier },
      });

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await Promise.all([
        db.user.update({
          where: { id: existingUser.id },
          data: { hashedPassword },
        }),
        db.verificationToken.delete({
          where: { token: existingToken.token },
        }),
      ]);
    }),
  verifyEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ input: token }) => {
      const existingToken = await db.verificationToken.findUnique({
        where: { token },
      });

      if (!existingToken) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const existingUser = await db.user.findFirst({
        where: { email: existingToken.identifier },
      });

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await Promise.all([
        db.user.update({
          where: { email: existingToken.identifier },
          data: { emailVerified: new Date() },
        }),
        db.verificationToken.delete({
          where: { token: existingToken.token },
        }),
      ]);
    }),
  resetPassword: publicProcedure
    .input(z.string())
    .mutation(async ({ input: email }) => {
      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(email, passwordResetToken.token);
    }),
});
