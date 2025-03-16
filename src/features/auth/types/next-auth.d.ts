import type { UserRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  requiresTwoFactor: boolean;
  role: UserRole;
  twoFactorAuthenticated: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
