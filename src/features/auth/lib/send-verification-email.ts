import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);
const domain = siteConfig.url;

interface Props {
  email: string;
  isTest?: boolean;
  token: string;
  type: '2fa' | 'reset' | 'verify';
}

/**
 * Send an email to given email for verification, password reset or 2fa authentication.
 *
 * @param email Email of the user
 * @param token Token to be sent that the client received
 * @param type Type of the token
 */
export const sendAuthMail = async ({ email, isTest, token, type }: Props) => {
  const logContext = { email, token: token.slice(0, 12) + '...', type };

  if (isTest) {
    return;
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      logger.debug('sendAuthMail (user_not_found): %o', logContext);
      throw new Error('Unauthorized.');
    }

    // TODO: Add a check for existing verification token

    const isVerify = type === 'verify';
    const confirmLink = isVerify
      ? `${domain}/verify-email?token=${token}`
      : `${domain}/reset-password?token=${token}`;
    const html = isVerify
      ? `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
      : `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`;
    const subject = isVerify ? 'Verify your email' : 'Reset your password';

    await resend.emails.send({
      from: env.EMAIL_FROM,
      html,
      subject,
      to: email,
    });

    logger.debug('sendAuthMail (done): %o', logContext);
  } catch (error) {
    logger.error(
      'sendAuthMail (error): %o, error=%s',
      logContext,
      error instanceof Error ? error.message : String(error),
    );
  }
  throw new Error('Mail not sent.');
};
