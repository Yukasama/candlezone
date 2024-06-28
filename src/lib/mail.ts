'use server'

import { siteConfig } from '@/config/site'
import { env } from '@/env.mjs'
import { Resend } from 'resend'
import { logger } from './logger'
import { SendEmailProps, SendEmailSchema } from './validators/user'

const resend = new Resend(env.RESEND_API_KEY)
const domain = siteConfig.url

/**
 * Send a password reset email to given email.
 * @param values `SendEmailSchema` validator
 */
export const sendPasswordResetEmail = async (values: SendEmailProps) => {
  const validatedFields = SendEmailSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('sendPasswordResetEmail (invalid_fields): values=%o', values)
    throw new Error('Invalid fields.')
  }

  const { email, token } = validatedFields.data

  const resetLink = `${domain}/reset-password?token=${token}`

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  })

  logger.debug('sendPasswordResetEmail (done): email=%s', email)
}

/**
 * Send a verification email to given email.
 * @param values `SendEmailSchema` validator
 */
export const sendVerificationEmail = async (values: SendEmailProps) => {
  const validatedFields = SendEmailSchema.safeParse(values)
  if (!validatedFields.success) {
    logger.debug('sendVerificationEmail (invalid_fields): values=%o', values)
    throw new Error('Invalid fields.')
  }

  const { email, token } = validatedFields.data

  const confirmLink = `${domain}/verify-email?token=${token}`

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  })

  logger.debug('sendVerificationEmail (done): email=%s', email)
}
