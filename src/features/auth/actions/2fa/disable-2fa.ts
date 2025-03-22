'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';
import speakeasy from 'speakeasy';
import { decrypt } from '../../lib/decrypt';
import { Disable2faInput, Disable2faSchema } from '../../lib/validators';
import { getUser } from '../get-user';

const ERROR_MSG = 'Something went wrong.';

export const disable2fa = async (values: Disable2faInput) => {
  const { code } = validateSchema({
    fnName: 'disable2fa',
    schema: Disable2faSchema,
    values,
  });

  try {
    const user = await getUser();
    if (!user) {
      return { error: ERROR_MSG };
    }

    const dbUser = await db.user.findUnique({
      select: {
        id: true,
        twoFactorTotpAuthentication: {
          select: { secret: true },
        },
      },
      where: { id: user.id },
    });

    if (!dbUser?.twoFactorTotpAuthentication) {
      logger.debug('verify2fa (no_totp_setup): userId=%s', dbUser?.id);
      return { error: 'Two-factor authentication not set up.' };
    }

    const decryptedSecret = decrypt({
      encryptedText: dbUser.twoFactorTotpAuthentication.secret,
    });

    const verified = speakeasy.totp.verify({
      encoding: 'base32',
      secret: decryptedSecret,
      token: code,
      window: 1,
    });

    if (!verified) {
      logger.debug(
        'verify2fa (invalid_code): userId=%s, code=%s',
        dbUser.id,
        code,
      );
      return { error: ERROR_MSG };
    }

    await db.$transaction(async (tx) => {
      await tx.twoFactorTotpConfirmation.delete({
        where: { userId: user.id },
      });
      await tx.user.update({
        data: { twoFactor: null },
        where: { id: user.id },
      });
    });

    logger.debug('enable2fa (done): userId=%s', user.id);
    return { success: true };
  } catch (error) {
    logger.debug(
      'disable2fa (error): code=%s, error=%s',
      code,
      error instanceof Error ? error.message : String(error),
    );
    return { error: ERROR_MSG };
  }
};
