'use server';

import { DEFAULT_AUTH_REDIRECT } from '@/config/routes';
import { SignInProps, SignInSchema } from '@/features/auth/lib/validators';
import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { AuthError } from 'next-auth';
import {
  generate2FAToken,
  generateVerificationToken,
} from '../lib/generate-token';
import { sendAuthMail } from '../lib/send-verification-email';

const ERROR_MSG = 'Invalid credentials.';

/**
 * Sign in user with email and password.
 * @param values `SignInSchema` validator
 * @returns Success or error JSON object
 */
export const login = async (values: SignInProps) => {
  const { data, error, success } = SignInSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'login (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: ERROR_MSG };
  }

  const { email, password, redirectUrl } = data;

  try {
    const existingUser = await db.user.findUnique({
      select: {
        email: true,
        emailVerified: true,
        hashedPassword: true,
        twoFactor: true,
      },
      where: { email },
    });

    if (!existingUser?.email || !existingUser.hashedPassword) {
      logger.debug('login (invalid_credentials): email=%s', email);
      return { error: ERROR_MSG };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken({
        email: existingUser.email,
      });
      await sendAuthMail({ ...verificationToken, type: 'verify' });

      logger.debug('login (mail_sent): email=%s', email);
      return { success: 'Confirmation email sent!' };
    }

    if (existingUser.twoFactor === 'EMAIL') {
      const verificationToken = await generate2FAToken({
        email: existingUser.email,
      });
      await sendAuthMail({ ...verificationToken, type: '2fa' });

      logger.debug('login (2fa_mail_sent): email=%s', email);
      return { twoFactor: true };
    }

    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectUrl ?? DEFAULT_AUTH_REDIRECT,
    });

    logger.debug('login (done): email=%s', email);
    return { success: 'Successfully logged in.' };
  } catch (error) {
    if (error instanceof AuthError) {
      logger.debug(
        'login (auth_error): email=%s, error=%s',
        email,
        error.message,
      );
      if (error.type === 'CredentialsSignin') {
        return { error: ERROR_MSG };
      }
    } else if (error instanceof Error) {
      logger.debug('login (error): email=%s, error=%s', email, error);
      return { error: ERROR_MSG };
    }

    logger.debug('login (internal_error): email=%s, error=%s', email, error);
    return { error: 'We have trouble signing you in.' };
  }
};
