'use server';

import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { CreateUserProps, CreateUserSchema } from '@/lib/validators/user';
import bcryptjs from 'bcryptjs';
import { generateName } from './utils/generate-name';
import { generateVerificationToken } from './utils/generate-token';
import { sendVerificationEmail } from './utils/send-mail';

/**
 * Register a new user with email and password, send a verification email.
 * @param values `CreateUserSchema` validator
 * @returns Success or error JSON object
 */
export const register = async (values: CreateUserProps) => {
  const validatedFields = CreateUserSchema.safeParse(values);
  if (!validatedFields.success) {
    logger.debug(
      'register (invalid_data): values=%o, issues=%o',
      values,
      validatedFields.error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await db.user.findFirst({
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
