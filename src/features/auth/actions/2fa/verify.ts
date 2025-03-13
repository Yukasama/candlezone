'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import speakeasy from 'speakeasy';
import { decrypt, encrypt } from '../../lib/decrypt';
import { Verify2faInput, Verify2faSchema } from '../../lib/validators';
import { getUser } from '../get-user';

const ERROR_MSG = 'Two factor verification failed.';

export const verify2fa = async (values: Verify2faInput) => {
  const { data, error, success } = Verify2faSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'verify2fa (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    return { error: ERROR_MSG };
  }

  const { secret, token } = data;
  const user = await getUser();

  if (user) {
    const decryptedSecret = decrypt({ encryptedText: secret });
    const verified = speakeasy.totp.verify({
      encoding: 'base32',
      secret: decryptedSecret,
      token,
    });

    if (verified) {
      const encryptedSecret = encrypt({ text: secret });

      await db.twoFactorTotpConfirmation.upsert({
        create: { secret: encryptedSecret, userId: user.id },
        update: { secret: encryptedSecret },
        where: { userId: user.id },
      });
    }

    return { verified };
  }

  return { error: ERROR_MSG };
};
