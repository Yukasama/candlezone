import { z } from 'zod';

const LOGIN_PASSWORD_MESSAGE = 'Please enter a valid password.';
const PASSWORD_MATCH_MESSAGE = 'Passwords do not match.';

const EmailSchema = z.string().email('Please enter a valid email.').trim();
const PasswordSchema = z
  .string()
  .min(8, { message: 'Be at least 8 characters long' })
  .regex(/[a-z]/i, { message: 'Contain at least one letter.' })
  .regex(/\d/, { message: 'Contain at least one number.' })
  .regex(/[^a-z0-9]/i, {
    message: 'Contain at least one special character.',
  })
  .trim();

export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, LOGIN_PASSWORD_MESSAGE),
});

export const SignUpSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: PASSWORD_MATCH_MESSAGE,
    path: ['confPassword'],
  });

export const CreateUserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  biography: z.string().optional(),
});

export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordSchema = z.object({
  password: PasswordSchema,
  token: z.string(),
});

export const VerifyEmailSchema = z.object({
  token: z.string(),
});

export const SendEmailSchema = z.object({
  email: EmailSchema,
  token: z.string(),
});

export const NewPasswordSchema = z
  .object({
    password: PasswordSchema,
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: PASSWORD_MATCH_MESSAGE,
    path: ['confPassword'],
  });

export type SignInProps = z.infer<typeof SignInSchema>;
export type SignUpProps = z.infer<typeof SignUpSchema>;
export type CreateUserProps = z.infer<typeof CreateUserSchema>;
export type UpdateUserProps = z.infer<typeof UpdateUserSchema>;
export type ForgotPasswordProps = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordProps = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailProps = z.infer<typeof VerifyEmailSchema>;
export type SendEmailProps = z.infer<typeof SendEmailSchema>;
export type NewPasswordProps = z.infer<typeof NewPasswordSchema>;
