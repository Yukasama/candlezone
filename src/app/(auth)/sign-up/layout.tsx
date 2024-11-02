import { AuthCard } from '@/features/auth/components/auth-card';
import { OAuthSection } from '@/features/auth/oauth-section';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export const metadata = { title: 'Sign Up' };
export const runtime = 'edge';

export default function SignUpLayout({ children }: PropsWithChildren) {
  return (
    <AuthCard
      header="Create an account"
      subHeader="Enter your email below to create your account."
    >
      <div className="space-y-4">
        {children}
        <OAuthSection />
      </div>

      <div className="f-box gap-1.5 text-sm">
        <p className="text-gray-400">Already signed up?</p>
        <Link href="/sign-in" className="font-medium">
          Sign In.
        </Link>
      </div>
    </AuthCard>
  );
}
