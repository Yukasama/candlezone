'use server';

import { appConfig } from '@/config/app';
import { DEFAULT_AUTH_REDIRECT } from '@/config/routes';
import { SignInProps, SignInSchema } from '@/features/auth/lib/validators';
import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { ERROR_CODES } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { AuthError } from 'next-auth';
import {
  generateEmail2FAToken,
  generateVerificationToken,
} from '../lib/generate-token';
import { sendAuthMail } from '../lib/send-verification-email';

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
    return { error: ERROR_CODES.INVALID_CREDENTIALS };
  }

  const { email, password, redirectUrl } = data;

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
      await sendAuthMail({ ...verificationToken, type: 'verify' });

      logger.debug('login (mail_sent): email=%s', email);
      return { success: 'Confirmation email sent!' };
    }

    if (existingUser.twoFactor === 'EMAIL') {
      const verificationToken = await generateEmail2FAToken({
        email: existingUser.email,
      });
      await sendAuthMail({ ...verificationToken, type: '2fa' });

      logger.debug('login (2fa_mail_sent): email=%s', email);
      return { twoFactor: true };
    }

    if (existingUser.twoFactor === 'TOTP') {
      const isTwoFactorEnabled = await db.twoFactorTotpConfirmation.findUnique({
        where: { userId: existingUser.id },
      });

      if (isTwoFactorEnabled) {
        const flow = await db.twoFactorFlow.create({
          data: {
            expires: new Date(Date.now() + appConfig.token.twoFactorExpiry),
            userId: existingUser.id,
          },
          select: { id: true },
        });

        if (!flow.id) {
          logger.error('login (2fa_flow_error): email=%s', email);
          return { error: 'We have trouble signing you in.' };
        }

        logger.debug('login (2fa_otp_flow_set): email=%s', email);
        return { twoFactor: true };
      }

      // This should not happen, but just in case
      logger.warn('login (2fa_enabled_without_secret): email=%s', email);
    }

    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectUrl ?? DEFAULT_AUTH_REDIRECT,
    });

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
    } else {
      logger.debug(
        'login (error): email=%s, error=%s',
        email,
        error instanceof Error ? error.message : String(error),
      );
      return { error: ERROR_CODES.INVALID_CREDENTIALS };
    }
  }

  logger.debug('login (internal_error): email=%s, error=%s', email, error);
  return { error: 'We have trouble signing you in.' };
};
