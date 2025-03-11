import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';
import { SendEmailProps, SendEmailSchema } from './validators';

const resend = new Resend(env.RESEND_API_KEY);
const domain = siteConfig.url;

/**
 * Send a verification email to given email for verification or password reset.
 * @param values `SendEmailSchema` validator
 */
export const sendVerificationEmail = async (values: SendEmailProps) => {
  const { data, error, success } = SendEmailSchema.safeParse(values);
  if (!success) {
    logger.debug(
      'sendVerificationEmail (invalid_data): values=%o, issues=%o',
      values,
      error.issues,
    );
    throw new Error('Invalid data.');
  }

  const { email, token, type } = data;
  const logContext = { ...data, token: token.slice(0, 12) + '...' };

  try {
    const isTestEmail =
      email.startsWith('playwright-test-') && email.endsWith('@zenathra.com');
    if (isTestEmail) {
      logger.debug('sendVerificationEmail (test_not_sent): %o', logContext);
      throw new Error('Email not sent due to testing.');
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      logger.debug('sendVerificationEmail (user_not_found): %o', logContext);
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

    logger.debug('sendVerificationEmail (done): %o', logContext);
  } catch (error) {
    logger.error(
      'sendVerificationEmail (error): %o, error=%s',
      logContext,
      error instanceof Error ? error.message : String(error),
    );
  }
  throw new Error('Mail not sent.');
};
