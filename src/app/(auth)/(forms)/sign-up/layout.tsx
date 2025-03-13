import { AuthCard } from '@/features/auth/components/auth-card';
import { OAuthSection } from '@/features/auth/components/oauth-section';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Sign Up' };

export default function SignUpLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <AuthCard
      header="Create an account"
      subHeader="Enter your email below to create your account."
    >
      <div className="space-y-4">
        {children}
        <OAuthSection />
      </div>

      <div className="flex items-center justify-center gap-1.5 text-sm">
        <p className="text-desc">Already signed up?</p>
        <Link className="font-medium" href="/sign-in">
          Sign In.
        </Link>
      </div>
    </AuthCard>
  );
}
