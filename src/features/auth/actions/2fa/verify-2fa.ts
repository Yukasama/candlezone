'use server';

import { signIn } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';
import { revalidatePath } from 'next/cache';
import speakeasy from 'speakeasy';
import { decrypt2faSecret } from '../../lib/decrypt';
import { SignInProps, SignInSchema } from '../../lib/validators';

const ERROR_MSG = 'Invalid authentication code.';

export const verify2fa = async (values: SignInProps) => {
  const { code, email, password } = validateSchema({
    fnName: 'verify2fa',
    schema: SignInSchema,
    values,
  });

  try {
    if (code?.length !== 6) {
      logger.debug('verify2fa (invalid_code): email=%s', email);
      return { error: ERROR_MSG };
    }

    const dbUser = await db.user.findUnique({
      select: {
        id: true,
        twoFactorTotpAuthentication: { select: { secret: true } },
      },
      where: { email },
    });

    if (!dbUser?.twoFactorTotpAuthentication) {
      logger.debug('verify2fa (no_totp_setup): userId=%s', dbUser?.id);
      return { error: 'Two-factor authentication not set up.' };
    }

    const decryptedSecret = decrypt2faSecret(
      dbUser.twoFactorTotpAuthentication.secret,
    );

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

    await signIn('credentials', { email, password, redirect: false });
    revalidatePath('/sign-in');
    logger.debug('verify2fa (success): userId=%s', dbUser.id);
    return { success: true };
  } catch (error) {
    logger.error('verify2fa (error): %o', error);
    return { error: 'Authentication failed.' };
  }
};
