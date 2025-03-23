'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import speakeasy from 'speakeasy';
import { encrypt2faSecret } from '../../lib/decrypt';
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

  const verified = speakeasy.totp.verify({ encoding: 'base32', secret, token });

  if (verified) {
    const encryptedSecret = encrypt2faSecret(secret);

    await db.$transaction(async (tx) => {
      await tx.twoFactorTotpConfirmation.upsert({
        create: { secret: encryptedSecret, userId: user.id },
        update: { secret: encryptedSecret },
        where: { userId: user.id },
      });

      await tx.user.update({
        data: { twoFactor: new Date() },
        where: { id: user.id },
      });
    });

    logger.debug('enable2fa (done): userId=%s', user.id);

    return { verified };
  }

  return { error: ERROR_MSG };
};
