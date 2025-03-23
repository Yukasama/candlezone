'use server';

import {
  VerifyEmailProps,
  VerifyEmailSchema,
} from '@/features/auth/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const ERROR_MSG = 'No or invalid token provided.';

/**
 * Verify the email of a user.
 *
 * @param values `VerifyEmailSchema` validator
 * @returns Success or error JSON object
 */
export const verifyEmail = async (values: VerifyEmailProps) => {
  const { data, error, success } = VerifyEmailSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'verifyEmail (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: ERROR_MSG };
  }

  const { token } = data;

  try {
    const existingToken = await db.verificationRequest.findFirst({
      orderBy: { expires: 'desc' },
      where: { token },
    });

    if (!existingToken) {
      logger.debug('verifyEmail (not_found): token=%s', existingToken);
      return { error: ERROR_MSG };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      logger.debug(
        'verifyEmail (expired): token=%s, expired=%s',
        existingToken,
        new Date(existingToken.expires).toISOString(),
      );
      return { error: 'This token has expired.' };
    }

    const existingUser = await db.user.count({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      logger.debug('verifyEmail (not_found): token=%s', existingToken);
      return { error: ERROR_MSG };
    }

    await db.$transaction(async (tx) => {
      await tx.user.update({
        data: { email: existingToken.email, emailVerified: new Date() },
        where: { email: existingToken.email },
      });
      await tx.verificationRequest.delete({
        where: { id: existingToken.id },
      });
    });

    logger.debug(
      'verifyEmail (done): email=%s, token=%s',
      existingToken.email,
      token,
    );

    return { success: 'Email verified successfully.' };
  } catch (error) {
    logger.error(
      'verifyEmail (error): %o, error=%s',
      data,
      error instanceof Error ? error.message : String(error),
    );
  }
  return { error: ERROR_MSG };
};
