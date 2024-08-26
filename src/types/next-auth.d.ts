import { UserRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  role: UserRole;
};

declare module 'next-auth' {
  /* eslint-disable no-unused-vars */
  interface Session {
    user: ExtendedUser;
  }
  /* eslint-enable no-unused-vars */
}
