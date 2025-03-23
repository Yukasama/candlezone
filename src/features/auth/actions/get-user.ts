import { auth } from '@/lib/auth';

/**
 * Get the user object from the session.
 * @returns User object
 */
export const getUser = async () => {
  const session = await auth();
  return session?.user;
};
