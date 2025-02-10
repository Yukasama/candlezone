'use server';

import {
  VerifyEmailProps,
  VerifyEmailSchema,
} from '@/features/auth/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Verify the email of a user.
 * @param values `VerifyEmailSchema` validator
 * @returns Success or error JSON object
 */
export const verifyEmail = async (values: VerifyEmailProps) => {
  const errorMsg = 'No or invalid token provided.';

  const { data, success, error } = VerifyEmailSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'verifyEmail (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: errorMsg };
  }

  const { token } = data;

  const existingToken = await db.verificationToken.findFirst({
    where: { token },
    orderBy: {
      expires: 'desc',
    },
  });

  if (!existingToken) {
    logger.debug('verifyEmail (not_found): token=%s', existingToken);
    return { error: errorMsg };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    logger.debug('verifyEmail (expired): token=%s', existingToken);
    return { error: errorMsg };
  }

  const existingUser = await db.user.count({
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    logger.debug('verifyEmail (user_missing): token=%s', existingToken);
    return { error: errorMsg };
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: existingToken.identifier },
      data: { emailVerified: new Date() },
    });
    await tx.verificationToken.delete({
      where: { token: existingToken.token },
    });
  });

  logger.debug('verifyEmail (done): email=%s', existingToken.identifier);

  return { success: 'Email verified successfully.' };
};
