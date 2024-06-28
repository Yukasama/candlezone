'use server'

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { VerifyEmailProps, VerifyEmailSchema } from '@/lib/validators/user'

/**
 * Verify the email of a user.
 * @param values `VerifyEmailSchema` validator
 * @returns Success or error JSON object
 */
export const verifyEmail = async (values: VerifyEmailProps) => {
  const errorMsg = 'No or invalid token provided.'

  const validatedFields = VerifyEmailSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('verifyEmail (invalid_fields): values=%o', values)
    return { error: errorMsg }
  }

  const { token } = validatedFields.data

  const existingToken = await db.verificationToken.findFirst({
    where: { token },
    orderBy: {
      expires: 'desc',
    },
  })

  if (!existingToken) {
    logger.debug('verifyEmail (not_found): token=%s', existingToken)
    return { error: errorMsg }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    logger.debug('verifyEmail (expired): token=%s', existingToken)
    return { error: errorMsg }
  }

  const existingUser = await db.user.count({
    where: { email: existingToken.identifier },
  })

  if (!existingUser) {
    logger.debug('verifyEmail (user_missing): token=%s', existingToken)
    return { error: errorMsg }
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: existingToken.identifier },
      data: { emailVerified: new Date() },
    })
    await tx.verificationToken.delete({
      where: { token: existingToken.token },
    })
  })

  logger.debug('verifyEmail (done): email=%s', existingToken.identifier)

  return { success: 'Email verified successfully.' }
}
