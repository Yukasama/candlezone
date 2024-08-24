'use server'

import { signIn } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/token'
import { SignInProps, SignInSchema } from '@/lib/validators/user'
import { AuthError } from 'next-auth'
import { revalidatePath } from 'next/cache'

/**
 * Sign in user with email and password.
 * @param values `SignInSchema` validator
 * @returns Success or error JSON object
 */
export const login = async (values: SignInProps) => {
  const errorMsg = 'Invalid credentials.'

  const validatedFields = SignInSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug(
      'login (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    )
    return { error: errorMsg }
  }

  const { email, password } = validatedFields.data

  const existingUser = await db.user.findUnique({ where: { email } })
  if (!existingUser?.email) {
    logger.debug('login (not_found): email=%s', email)
    return { error: errorMsg }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken({
        email: existingUser.email,
      })

      await sendVerificationEmail({
        email: verificationToken.identifier,
        token: verificationToken.token,
      })
    }

    revalidatePath('/dashboard')
    logger.debug('login (done): email=%s', email)
    return { success: 'Confirmation email sent.' }
  } catch (error) {
    if (error instanceof AuthError) {
      logger.debug(
        'login (auth_error): email=%s, error=%s',
        email,
        error.message,
      )
      if (error.type === 'CredentialsSignin') {
        return { error: errorMsg }
      }
    }

    logger.debug('login (internal_error): email=%s, error=%s', email, error)

    return { error: 'We have trouble signing you in.' }
  }
}
