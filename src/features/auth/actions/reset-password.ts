'use server';

import {
  ResetPasswordProps,
  ResetPasswordSchema,
} from '@/features/auth/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';

/**
 * Reset the user's password.
 * @param values `ResetPasswordSchema` validator
 * @returns Success or error JSON object
 */
export const resetPassword = async (values: ResetPasswordProps) => {
  const errorMsg = 'An error occured.';

  const { data, error, success } = ResetPasswordSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'resetPassword (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { password, token } = data;

  const existingToken = await db.verificationRequest.findUnique({
    where: { token },
  });

  if (!existingToken) {
    logger.debug('resetPassword (not_found): token=%s', existingToken);
    return { error: errorMsg };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    logger.debug('resetPassword (expired): token=%s', existingToken);
    return { error: errorMsg };
  }

  const existingUser = await db.user.findUnique({
    select: {
      email: true,
      id: true,
    },
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    return { error: errorMsg };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.$transaction(async (tx) => {
    await tx.user.update({
      data: { hashedPassword },
      where: { id: existingUser.id },
    });
    await tx.verificationRequest.delete({
      where: { token: existingToken.token },
    });
  });

  logger.debug('resetPassword (done): email=%s', existingUser.email);

  return { success: 'Password successfully reset.' };
};
