'use server';

import {
  ResetPasswordProps,
  ResetPasswordSchema,
} from '@/features/user/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import bcryptjs from 'bcryptjs';

/**
 * Reset the user's password.
 * @param values `ResetPasswordSchema` validator
 * @returns Success or error JSON object
 */
export const resetPassword = async (values: ResetPasswordProps) => {
  const errorMsg = 'An error occured.';

  const { data, success, error } = ResetPasswordSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'resetPassword (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { password, token } = data;

  const existingToken = await db.verificationToken.findUnique({
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
      id: true,
      email: true,
    },
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    return { error: errorMsg };
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: existingUser.id },
      data: { hashedPassword },
    });
    await tx.verificationToken.delete({
      where: { token: existingToken.token },
    });
  });

  logger.debug('resetPassword (done): email=%s', existingUser.email);

  return { success: 'Password successfully reset.' };
};
