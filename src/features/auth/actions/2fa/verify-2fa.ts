'use server';

import { auth } from '@/lib/auth';
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

  const { code } = data;

  const session = await auth();
  const authenticatedUserId = session?.user.id;

  if (!authenticatedUserId) {
    logger.debug('verify2fa (no_user_id)');
    return { error: 'Authentication required' };
  }

  try {
    // Find the active TwoFactorFlow record for this user
    const twoFactorFlow = await db.twoFactorFlow.findFirst({
      where: {
        confirmed: null, // Not already confirmed
        expires: { gt: new Date() }, // Not expired
        userId: authenticatedUserId,
      },
    });

    if (!twoFactorFlow) {
      logger.debug(
        'verify2fa (no_active_flow): userId=%s',
        authenticatedUserId,
      );
      return {
        error: 'No active authentication session. Please try logging in again.',
      };
    }

    // Get the stored encrypted TOTP secret
    const twoFactorConfirmation = await db.twoFactorTotpConfirmation.findUnique(
      {
        where: { userId: authenticatedUserId },
      },
    );

    if (!twoFactorConfirmation) {
      logger.debug('verify2fa (no_totp_setup): userId=%s', authenticatedUserId);
      return { error: 'Two-factor authentication not set up.' };
    }

    // Decrypt the stored secret
    const decryptedSecret = decrypt({
      encryptedText: twoFactorConfirmation.secret,
    });

    // Verify the provided code against the decrypted secret
    const verified = speakeasy.totp.verify({
      encoding: 'base32',
      secret: decryptedSecret,
      token: code,
      window: 1, // Allow 1 step before/after for time drift
    });

    if (!verified) {
      logger.debug('verify2fa (invalid_code): userId=%s', authenticatedUserId);
      return { error: ERROR_MSG };
    }

    // Mark the flow as confirmed by updating the confirmed timestamp
    await db.twoFactorFlow.update({
      data: { confirmed: new Date() },
      where: { id: twoFactorFlow.id },
    });

    logger.debug('verify2fa (success): userId=%s', authenticatedUserId);
    return { success: true };
  } catch (error) {
    logger.error('verify2fa (error): %o', error);
    return { error: 'Authentication failed.' };
  }
};
