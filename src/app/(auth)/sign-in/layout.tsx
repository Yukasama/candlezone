import { AuthCard } from '@/features/auth/components/auth-card';
import { OAuthSection } from '@/features/auth/oauth-section';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Sign In' };

export default function SignInPageLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <AuthCard
      header="Sign in to your account"
      subHeader="Enter your credentials to sign in to your account."
    >
      <div className="space-y-4">
        {children}
        <OAuthSection />
      </div>

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <p className="text-desc">New to our platform?</p>
        <Link className="font-medium" href="/sign-up">
          Sign Up.
        </Link>
      </div>
    </AuthCard>
  );
}
