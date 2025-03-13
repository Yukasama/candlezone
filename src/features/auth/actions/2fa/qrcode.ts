'use server';

import { siteConfig } from '@/config/site';
import QRCode from 'qrcode';

import speakeasy from 'speakeasy';

export const generateQrCode = async () => {
  const secret = speakeasy.generateSecret({ name: siteConfig.name });
  if (!secret.otpauth_url) {
    return { error: 'Failed to generate secret' };
  }

  const data = await QRCode.toDataURL(secret.otpauth_url);

  return { data, secret: secret.base32 };
};
