'use server';

import { db } from '@/lib/db';
import speakeasy from 'speakeasy';
import { encrypt } from '../../lib/decrypt';

export const enable2fa = async (userId: string) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const encryptedSecret = encrypt({ text: secret.base32 });

  await db.twoFactorTotpConfirmation.upsert({
    create: { secret: encryptedSecret, userId },
    update: { secret: encryptedSecret },
    where: { userId },
  });

  return secret.otpauth_url;
};
