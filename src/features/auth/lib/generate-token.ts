import { appConfig } from '@/config/app';
import { db } from '@/lib/db';
import { randomInt, randomUUID } from 'node:crypto';

interface Props {
  email: string;
}

/**
 * Generate a password reset token for the user.
 *
 * @param email Email of the user where token will be created
 * @returns Password reset token
 */
export const generatePasswordResetToken = async ({ email }: Props) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + appConfig.token.newPasswordExpiry);

  const existingToken = await db.passwordResetRequest.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.passwordResetRequest.delete({
      where: { id: existingToken.id },
    });
  }

  return await db.passwordResetRequest.create({
    data: { email, expires, token },
  });
};

/**
 * Generate a verification token for the user.
 *
 * @param email Email of the user where token will be created
 * @returns Verification token
 */
export const generateVerificationToken = async ({ email }: Props) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + appConfig.token.verifyExpiry);

  const existingToken = await db.verificationRequest.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.verificationRequest.delete({
      where: { id: existingToken.id },
    });
  }

  return await db.verificationRequest.create({
    data: { email, expires, token },
  });
};

/**
 * Generate a 2FA token for the user.
 *
 * @param email Email of the user where token will be created
 * @returns 2FA token
 */
export const generate2FAToken = async ({ email }: Props) => {
  const token = String(randomInt(100_000, 1_000_000));
  const expires = new Date(Date.now() + appConfig.token.twoFactorExpiry);

  const existingToken = await db.twoFactorEmailToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.twoFactorEmailToken.delete({
      where: { id: existingToken.id },
    });
  }

  return await db.twoFactorEmailToken.create({
    data: { email, expires, token },
  });
};
