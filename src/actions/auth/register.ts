'use server'

import { db } from '@/lib/db'
import { generateName } from '@/utils/generators/generate-name'
import { logger } from '@/lib/logger'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/token'
import { CreateUserProps, CreateUserSchema } from '@/lib/validators/user'
import { saltAndHashPassword } from '@/utils/encrypt-password'
import { signIn } from '@/lib/auth'

/**
 * Register a new user with email and password, send a verification email.
 * @param values `CreateUserSchema` validator
 * @returns Success or error JSON object
 */
export const register = async (values: CreateUserProps) => {
  const validatedFields = CreateUserSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('register (invalid_fields): values=%o', values)
    return { error: 'Invalid fields.' }
  }

  const { email, password } = validatedFields.data

  const existingUser = await db.user.findFirst({
    where: { email },
  })

  if (existingUser) {
    logger.debug('register (email_exists): email=%s', email)
    return { error: 'Email is already registered.' }
  }

  const [pwHash, verificationToken] = await Promise.all([
    saltAndHashPassword(password),
    generateVerificationToken({ email }),
  ])

  const name = generateName()

  await Promise.all([
    db.user.create({
      data: { name, email, hashedPassword: pwHash },
    }),
    sendVerificationEmail({
      email: email,
      token: verificationToken.token,
    }),
  ])

  await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

  logger.debug('register (done): email=%s pwHash=%s', email, pwHash)
  return { success: 'Confirmation email sent.' }
}
