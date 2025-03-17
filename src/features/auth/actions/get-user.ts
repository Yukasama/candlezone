import { auth } from '@/lib/auth';

export const getUser = async () => {
  const session = await auth();
  if (session?.user.requiresTwoFactor) {
    return;
  }

  return session?.user;
};
