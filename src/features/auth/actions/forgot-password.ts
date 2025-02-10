'use server';

import {
  ForgotPasswordProps,
  ForgotPasswordSchema,
} from '@/features/auth/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { generatePasswordResetToken } from '../lib/generate-token';
import { sendPasswordResetEmail } from '../lib/send-mail';

/**
 * Send a password reset email to the user.
 * @param values `ForgotPasswordSchema` validator
 * @returns Success or error JSON object
 */
export const forgotPassword = async (values: ForgotPasswordProps) => {
  const { data, success, error } = ForgotPasswordSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'forgotPassword (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { email } = data;

  const user = await db.user.count({ where: { email } });
  if (user) {
    const passwordResetToken = await generatePasswordResetToken({ email });
    await sendPasswordResetEmail({ email, token: passwordResetToken.token });
  }

  logger.debug('forgotPassword (done): email=%s', email);

  return { success: 'Reset email sent.' };
};
