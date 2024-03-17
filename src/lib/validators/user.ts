import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter a valid password."),
  code: z.string().optional(),
  callbackUrl: z.string().optional(),
});

export const SignUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email."),
    password: z
      .string()
      .min(11, "Password must contain 11 or more characters."),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords do not match",
    path: ["confPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export const CreateUserSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(11, "Password must be atleast 11 characters."),
});

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  biography: z
    .string()
    .max(500, "Biography can contain no more than 500 characters.")
    .optional(),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(11, "Password must contain 11 or more characters."),
  token: z.string(),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(11, "Password must contain 11 or more characters."),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords do not match.",
    path: ["confPassword"],
  });

export type CreateUserProps = z.infer<typeof CreateUserSchema>;

export type UserUpdateProps = z.infer<typeof UserUpdateSchema>;

export type ResetPasswordProps = z.infer<typeof ResetPasswordSchema>;
