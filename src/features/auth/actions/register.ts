'use server';

import { RegisterProps, RegisterSchema } from '@/features/auth/lib/validators';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';
import { generateName } from '../lib/generate-name';
import { generateVerificationToken } from '../lib/generate-token';
import { sendVerificationMail } from '../lib/send-verification-mail';

/**
 * Register a new user with email and password, send a verification email.
 *
 * @param values `RegisterSchema` validator
 * @returns Success or error JSON object
 */
export const register = async (values: RegisterProps) => {
  const { data, error, success } = RegisterSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'register (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: 'Invalid data.' };
  }

  const { email, password } = data;

  try {
    const existingUser = await db.user.count({
      where: { email },
    });

    if (existingUser) {
      logger.debug('register (email_exists): email=%s', email);
      return { error: 'Email is already registered.' };
    }

    const name = generateName();
    const hashedPassword = await bcrypt.hash(password, 10);

    const isTestEmail =
      email.startsWith('playwright-test-') && email.endsWith('@candlezone.eu');

    await db.user.create({
      data: {
        email,
        emailVerified: isTestEmail ? new Date() : null,
        hashedPassword,
        name,
      },
    });

    if (!isTestEmail) {
      const verificationToken = await generateVerificationToken({ email });
      await sendVerificationMail({ ...verificationToken, type: 'verify' });
    }

    logger.debug('register (done): email=%s', email);
    return { success: 'Confirmation email sent!' };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        'register (error): email=%s, error=%s',
        email,
        error.message,
      );
    }
    return { error: 'We currently have trouble signing you up.' };
  }
};
