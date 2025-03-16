'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import speakeasy from 'speakeasy';
import { encrypt } from '../../lib/decrypt';
import { Enable2faInput, Enable2faSchema } from '../../lib/validators';
import { getUser } from '../get-user';

const ERROR_MSG = 'Two factor verification failed.';

export const enable2fa = async (values: Enable2faInput) => {
  const { data, error, success } = Enable2faSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'enable2fa (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: ERROR_MSG };
  }

  const { secret, token } = data;
  const user = await getUser();

  if (!user) {
    return { error: ERROR_MSG };
  }

  const verified = speakeasy.totp.verify({
    encoding: 'base32',
    secret: secret,
    token,
  });

  if (verified) {
    const encryptedSecret = encrypt({ text: secret });

    await db.$transaction(async (tx) => {
      await tx.twoFactorTotpConfirmation.upsert({
        create: { secret: encryptedSecret, userId: user.id },
        update: { secret: encryptedSecret },
        where: { userId: user.id },
      });

      await tx.user.update({
        data: { twoFactor: 'TOTP' },
        where: { id: user.id },
      });
    });

    return { verified };
  }

  return { error: ERROR_MSG };
};
