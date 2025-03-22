import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';
import { AuthMailType } from '../types/mail';

const resend = new Resend(env.RESEND_API_KEY);
const domain = siteConfig.url;

interface Props {
  email: string;
  isTest?: boolean;
  token: string;
  type: AuthMailType;
}

const mailTemplate = (type: AuthMailType, token: string) => {
  const confirmLink: Record<AuthMailType, string> = {
    '2fa': `${domain}/two-factor?token=${token}`,
    reset: `${domain}/reset-password?token=${token}`,
    verify: `${domain}/verify-email?token=${token}`,
  };

  const html: Record<AuthMailType, string> = {
    '2fa': `<p>Click <a href="${confirmLink[type]}">here</a> to verify your email.</p>`,
    reset: `<p>Click <a href="${confirmLink[type]}">here</a> to reset your password. Do not share this with anyone!</p>`,
    verify: `<p>This is your 2FA Code <a href="${confirmLink[type]}">here</a>. Do not share it with anyone!</p>`,
  };

  const subject: Record<AuthMailType, string> = {
    '2fa': 'Verify your email',
    reset: 'Reset your password',
    verify: '2FA Code',
  };

  return { html: html[type], subject: subject[type] };
};

/**
 * Send an email to given email for verification, password reset or 2fa authentication.
 *
 * @param email Email of the user
 * @param token Token to be sent that the client received
 * @param type Type of the token (two factor, reset password, verify email)
 */
export const sendAuthMail = async ({ email, token, type }: Props) => {
  const logContext = { email, token: token.slice(0, 12) + '...', type };

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Unauthorized.');
    }

    let existingToken;
    if (type === 'verify') {
      existingToken = await db.verificationRequest.findFirst({
        where: {
          createdAt: { gt: new Date(Date.now() - 1000 * 60) },
          email,
        },
      });
    } else if (type === 'reset') {
      existingToken = await db.passwordResetRequest.findFirst({
        where: {
          createdAt: { gt: new Date(Date.now() - 1000 * 60) },
          email,
        },
      });
    }

    if (existingToken) {
      throw new Error('Mail already sent. Please wait for a minute.');
    }

    const { html, subject } = mailTemplate(type, token);

    await resend.emails.send({
      from: env.EMAIL_FROM,
      html,
      subject,
      to: email,
    });

    logger.debug('sendAuthMail (done): %o', logContext);
  } catch (error) {
    logger.debug(
      'sendAuthMail (error): %o, error=%s',
      logContext,
      error instanceof Error ? error.message : String(error),
    );
    throw new Error('Mail not sent.');
  }
};
