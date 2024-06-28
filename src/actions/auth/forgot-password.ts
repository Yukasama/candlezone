'use server'

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/token'
import {
  ForgotPasswordProps,
  ForgotPasswordSchema,
} from '@/lib/validators/user'

/**
 * Send a password reset email to the user.
 * @param values `ForgotPasswordSchema` validator
 * @returns Success or error JSON object
 */
export const forgotPassword = async (values: ForgotPasswordProps) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('forgotPassword (invalid_data): values=%o', values)
    return { error: 'Invalid data.' }
  }

  const { email } = validatedFields.data

  const user = await db.user.findFirst({
    where: { email },
  })

  if (user) {
    const passwordResetToken = await generatePasswordResetToken({ email })
    await sendPasswordResetEmail({ email, token: passwordResetToken.token })
  }

  logger.debug('forgotPassword (done): email=%s', email)

  return { success: 'Reset email sent.' }
}
