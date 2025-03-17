import { DEFAULT_AUTH_REDIRECT } from '@/config/routes';
import { TwoFactorForm } from '@/features/auth/two-factor-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Verify your login' };

export default async function TwoFactorPage() {
  const session = await auth();

  if (!session?.user.id || !session.user.requiresTwoFactor) {
    return redirect(DEFAULT_AUTH_REDIRECT);
  }

  return <TwoFactorForm userId={session.user.id} />;
}
