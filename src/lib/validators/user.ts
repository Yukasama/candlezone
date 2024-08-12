import { z } from 'zod'

const EMAIL_MESSAGE = 'Please enter a valid email.'
const PASSWORD_MESSAGE = 'Password must contain 11 or more characters.'

export const SignInSchema = z.object({
  email: z.string().email(EMAIL_MESSAGE),
  password: z.string(),
})

export const SignUpSchema = z
  .object({
    email: z.string().email(EMAIL_MESSAGE),
    password: z.string().min(11, PASSWORD_MESSAGE),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: 'Passwords do not match',
    path: ['confPassword'],
  })

export const CreateUserSchema = z.object({
  email: z.string().email(EMAIL_MESSAGE),
  password: z.string().min(11, PASSWORD_MESSAGE),
})

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  biography: z.string().optional(),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email(EMAIL_MESSAGE),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(11, PASSWORD_MESSAGE),
  token: z.string(),
})

export const VerifyEmailSchema = z.object({
  token: z.string(),
})

export const SendEmailSchema = z.object({
  email: z.string().email(EMAIL_MESSAGE),
  token: z.string(),
})

export const NewPasswordSchema = z
  .object({
    password: z.string().min(11, PASSWORD_MESSAGE),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: 'Passwords do not match.',
    path: ['confPassword'],
  })

export type SignInProps = z.infer<typeof SignInSchema>
export type SignUpProps = z.infer<typeof SignUpSchema>
export type CreateUserProps = z.infer<typeof CreateUserSchema>
export type UpdateUserProps = z.infer<typeof UpdateUserSchema>
export type ForgotPasswordProps = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordProps = z.infer<typeof ResetPasswordSchema>
export type VerifyEmailProps = z.infer<typeof VerifyEmailSchema>
export type SendEmailProps = z.infer<typeof SendEmailSchema>
export type NewPasswordProps = z.infer<typeof NewPasswordSchema>
