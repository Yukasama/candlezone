'use server';

import { SignInProps, SignInSchema } from '@/features/user/lib/validators';
import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { generateVerificationToken } from '../lib/generate-token';
import { sendVerificationEmail } from '../lib/send-mail';

/**
 * Sign in user with email and password.
 * @param values `SignInSchema` validator
 * @returns Success or error JSON object
 */
export const login = async (values: SignInProps) => {
  const errorMsg = 'Invalid credentials.';

  const { data, success, error } = SignInSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'login (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: errorMsg };
  }

  const { email, password } = data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (!existingUser?.email) {
    logger.debug('login (not_found): email=%s', email);
    return { error: errorMsg };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken({
        email: existingUser.email,
      });

      await sendVerificationEmail({
        email: verificationToken.identifier,
        token: verificationToken.token,
      });
    }

    revalidatePath('/sign-in');
    logger.debug('login (done): email=%s', email);
    return { success: 'Confirmation email sent.' };
  } catch (error) {
    if (error instanceof AuthError) {
      logger.debug(
        'login (auth_error): email=%s, error=%s',
        email,
        error.message,
      );
      if (error.type === 'CredentialsSignin') {
        return { error: errorMsg };
      }
    }

    logger.debug('login (internal_error): email=%s, error=%s', email, error);

    return { error: 'We have trouble signing you in.' };
  }
};
