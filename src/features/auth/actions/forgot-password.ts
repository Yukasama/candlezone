'use server';

import {
  ForgotPasswordProps,
  ForgotPasswordSchema,
} from '@/features/auth/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';
import { generateVerificationToken } from '../lib/generate-verification-token';
import { sendVerificationEmail } from '../lib/send-verification-email';

const ERROR_MSG = 'Reset email could not be sent.';
const SUCCESS_MSG = 'Reset email sent.';

/**
 * Send a password reset email to the user.
 * @param values `ForgotPasswordSchema` validator
 * @returns Success or error JSON object
 */
export const forgotPassword = async (values: ForgotPasswordProps) => {
  try {
    const { email } = validateSchema({
      fnName: 'forgotPassword',
      schema: ForgotPasswordSchema,
      values,
    });

    const user = await db.user.count({ where: { email } });
    if (user) {
      const passwordResetToken = await generateVerificationToken({ email });
      await sendVerificationEmail({
        email,
        token: passwordResetToken.token,
        type: 'reset',
      });

      logger.debug(
        'forgotPassword (done): email=%s, token=%s',
        email,
        passwordResetToken.token,
      );
      return { success: SUCCESS_MSG };
    }

    logger.debug('forgotPassword (not_found): email=%s', email);
    return { error: ERROR_MSG };
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('forgotPassword (error): %s', error.message);
    }
    logger.error('forgotPassword (error): %s', String(error));
    return { error: ERROR_MSG };
  }
};
