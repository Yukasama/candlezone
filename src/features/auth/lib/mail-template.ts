import { siteConfig } from '@/config/site';
import { AuthMailType } from '../types/mail';

const DOMAIN = siteConfig.url;

/**
 * Create a mail template for an authentication email.
 *
 * @param type reset for password reset, verify for email verification
 * @param token Token to be sent that the client received
 * @returns HTML and subject for the email
 */
export const mailTemplate = (type: AuthMailType, token: string) => {
  const confirmLink: Record<AuthMailType, string> = {
    reset: `${DOMAIN}/reset-password?token=${token}`,
    verify: `${DOMAIN}/verify-email?token=${token}`,
  };

  const html: Record<AuthMailType, string> = {
    reset: `<p>Click <a href="${confirmLink[type]}">here</a> to reset your password. Do not share this with anyone!</p>`,
    verify: `<p>Click <a href="${confirmLink[type]}">here</a> to verify your email. Do not share this with anyone!</p>`,
  };

  const subject: Record<AuthMailType, string> = {
    reset: 'Reset your password',
    verify: 'Verify your email',
  };

  return { html: html[type], subject: subject[type] };
};
