import { appConfig } from '@/config/app';
import { db } from '@/lib/db';
import { randomUUID } from 'node:crypto';

interface Props {
  email: string;
}

/**
 * Generate a verification token for the user.
 * @param email Email of the user where token will be created
 * @returns Verification token
 */
export const generateVerificationToken = async ({ email }: Props) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + appConfig.token.expiry);

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
