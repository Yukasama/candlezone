'use server';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import speakeasy from 'speakeasy';
import { decrypt } from '../../lib/decrypt';
import { Verify2faInput, Verify2faSchema } from '../../lib/validators';

const ERROR_MSG = 'Invalid authentication code.';

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

  const { code, userId } = data;

  try {
    const twoFactorConfirmation = await db.twoFactorTotpConfirmation.findUnique(
      { where: { userId } },
    );

    if (!twoFactorConfirmation) {
      logger.debug('verify2fa (no_totp_setup): userId=%s', userId);
      return { error: 'Two-factor authentication not set up.' };
    }

    const twoFactorFlow = await db.twoFactorFlow.findFirst({
      where: {
        confirmed: null,
        expires: { gt: new Date() },
        userId: userId,
      },
    });

    if (!twoFactorFlow) {
      logger.debug('verify2fa (no_active_or_expired_flow): userId=%s', userId);
      return {
        error: 'No active authentication session. Please try logging in again.',
      };
    }

    const decryptedSecret = decrypt({
      encryptedText: twoFactorConfirmation.secret,
    });

    const verified = speakeasy.totp.verify({
      encoding: 'base32',
      secret: decryptedSecret,
      token: code,
      window: 1,
    });

    if (!verified) {
      logger.debug('verify2fa (invalid_code): userId=%s', userId);
      return { error: ERROR_MSG };
    }

    await db.twoFactorFlow.update({
      data: { confirmed: new Date() },
      where: { id: twoFactorFlow.id },
    });

    logger.debug('verify2fa (success): userId=%s', userId);
    return { success: true };
  } catch (error) {
    logger.error('verify2fa (error): %o', error);
    return { error: 'Authentication failed.' };
  }
};
