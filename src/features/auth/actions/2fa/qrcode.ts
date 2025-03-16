'use server';

import { siteConfig } from '@/config/site';
import QRCode from 'qrcode';

import { ERROR_CODES } from '@/lib/errors';
import speakeasy from 'speakeasy';
import { getUser } from '../get-user';

export const generateQrCode = async () => {
  const user = await getUser();
  if (!user) {
    return { error: ERROR_CODES.UNAUTHORIZED };
  }

  const secret = speakeasy.generateSecret({
    length: 20,
    name: siteConfig.name,
  });
  if (!secret.otpauth_url) {
    return { error: 'Failed to generate secret.' };
  }

  const data = await QRCode.toDataURL(secret.otpauth_url);

  return { data, secret: secret.base32 };
};
