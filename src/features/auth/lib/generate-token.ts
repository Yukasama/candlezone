'use server';

import { appConfig } from '@/config/app';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  email: string;
}

/**
 * Generate a password reset token for the user.
 * @param email Email of the user where token will be created
 * @returns Verification token
 */
export const generatePasswordResetToken = async ({ email }: Props) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + appConfig.token.forgotPasswordExpiry);

  const existingToken = await db.verificationRequest.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationRequest.delete({
      where: { token: existingToken.token },
    });
  }

  return await db.verificationRequest.create({
    data: {
      expires,
      identifier: email,
      token,
    },
  });
};

/**
 * Generate a verification token for the user.
 * @param email Email of the user where token will be created
 * @returns Verification token
 */
export const generateVerificationToken = async ({ email }: Props) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + appConfig.token.verifyTokenExpiry);

  const existingToken = await db.verificationRequest.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationRequest.delete({
      where: { token: existingToken.token },
    });
  }

  return await db.verificationRequest.create({
    data: {
      expires,
      identifier: email,
      token,
    },
  });
};
