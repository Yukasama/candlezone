'use server';

import { RegisterProps, RegisterSchema } from '@/features/auth/lib/validators';
import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import bcryptjs from 'bcryptjs';
import { generateName } from '../lib/generate-name';
import { generateVerificationToken } from '../lib/generate-token';
import { sendVerificationEmail } from '../lib/send-mail';

/**
 * Register a new user with email and password, send a verification email.
 * @param values `RegisterSchema` validator
 * @returns Success or error JSON object
 */
export const register = async (values: RegisterProps) => {
  const { data, success, error } = RegisterSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'register (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { email, password } = data;

  const existingUser = await db.user.count({
    where: { email },
  });

  if (existingUser) {
    logger.debug('register (email_exists): email=%s', email);
    return { error: 'Email is already registered.' };
  }

  const [pwHash, verificationToken] = await Promise.all([
    bcryptjs.hash(password, 10),
    generateVerificationToken({ email }),
  ]);

  const name = generateName();

  await Promise.all([
    db.user.create({
      data: { name, email, hashedPassword: pwHash },
    }),
    sendVerificationEmail({
      email: email,
      token: verificationToken.token,
    }),
  ]);

  await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  logger.debug('register (done): email=%s, pwHash=%s', email, pwHash);

  return { success: 'Confirmation email sent.' };
};
