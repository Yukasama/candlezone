'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
  ForgotPasswordProps,
  ForgotPasswordSchema,
} from '@/lib/validators/user';
import { generatePasswordResetToken } from '../lib/generate-token';
import { sendPasswordResetEmail } from '../lib/send-mail';

/**
 * Send a password reset email to the user.
 * @param values `ForgotPasswordSchema` validator
 * @returns Success or error JSON object
 */
export const forgotPassword = async (values: ForgotPasswordProps) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'forgotPassword (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { email } = validatedFields.data;

  const user = await db.user.findFirst({
    where: { email },
  });

  if (user) {
    const passwordResetToken = await generatePasswordResetToken({ email });
    await sendPasswordResetEmail({ email, token: passwordResetToken.token });
  }

  logger.debug('forgotPassword (done): email=%s', email);

  return { success: 'Reset email sent.' };
};
