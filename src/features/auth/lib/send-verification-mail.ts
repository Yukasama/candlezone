import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';
import { AuthMailType } from '../types/mail';
import { mailTemplate } from './mail-template';

const resend = new Resend(env.RESEND_API_KEY);

interface Props {
  email: string;
  isTest?: boolean;
  token: string;
  type: AuthMailType;
}

/**
 * Send an email to given email for verification, password reset or 2fa authentication.
 *
 * @param email Email of the user
 * @param token Token to be sent that the client received
 * @param type Type of the token (two factor, reset password, verify email)
 */
export const sendVerificationMail = async ({ email, token, type }: Props) => {
  const logContext = { email, token: token.slice(0, 12) + '...', type };

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Unauthorized.');
    }

    const { html, subject } = mailTemplate(type, token);

    await resend.emails.send({
      from: env.EMAIL_FROM,
      html,
      subject,
      to: email,
    });

    logger.debug('sendVerificationMail (done): %o', logContext);
  } catch (error) {
    logger.debug(
      'sendVerificationMail (error): %o, error=%s',
      logContext,
      error instanceof Error ? error.message : String(error),
    );
    if (error instanceof Error) {
      throw new TypeError(error.message);
    }
  }
};
