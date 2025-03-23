'use server';

import { SignInProps, SignInSchema } from '@/features/auth/lib/validators';
import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { ERROR_CODES } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { generateVerificationToken } from '../lib/generate-token';
import { sendVerificationMail } from '../lib/send-verification-mail';

/**
 * Sign in user with email and password.
 *
 * @param values `SignInSchema` validator
 * @returns Success or error JSON object
 */
export const login = async (values: SignInProps) => {
  const { email, password } = validateSchema({
    fnName: 'login',
    schema: SignInSchema,
    values,
  });

  try {
    const existingUser = await db.user.findUnique({
      select: {
        email: true,
        emailVerified: true,
        hashedPassword: true,
        id: true,
        twoFactor: true,
      },
      where: { email },
    });

    if (!existingUser?.email || !existingUser.hashedPassword) {
      logger.debug('login (invalid_credentials): email=%s', email);
      return { error: ERROR_CODES.INVALID_CREDENTIALS };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken({
        email: existingUser.email,
      });
      await sendVerificationMail({ ...verificationToken, type: 'verify' });

      logger.debug('login (mail_sent): email=%s', email);
      return { success: 'Confirmation email sent!' };
    }

    if (existingUser.twoFactor) {
      const isTwoFactorEnabled = await db.twoFactorTotpConfirmation.findUnique({
        where: { userId: existingUser.id },
      });

      if (isTwoFactorEnabled) {
        logger.debug('login (2fa_required): email=%s', email);
        return { twoFactor: true };
      }

      // This should not happen, but just in case
      logger.warn('login (2fa_enabled_without_secret): email=%s', email);
    }

    await signIn('credentials', { email, password, redirect: false });
    revalidatePath('/sign-in');
    logger.debug('login (done): email=%s', email);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      logger.debug(
        'login (auth_error): email=%s, error=%s',
        email,
        error.message,
      );
      if (error.type === 'CredentialsSignin') {
        return { error: ERROR_CODES.INVALID_CREDENTIALS };
      }
    } else if (
      error instanceof Error &&
      error.message === 'Mail already sent. Please wait for a minute.'
    ) {
      return { error: ERROR_CODES.EMAIL_ALREADY_SENT };
    }

    logger.debug('login (internal_error): email=%s, error=%s', email, error);
    return { error: 'We have trouble signing you in.' };
  }
};
